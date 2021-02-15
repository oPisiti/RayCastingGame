// 04/01/2020 Lauro França
// Ray casting from the mouse position to all the wall lines


let map_walls=[];
let wall=[];
let light;

let background_color=0;
let n_rays=1200;
let fov=45;                                   // FOV in degrees

let camera_mode="arrow";                      // "mouse" for mouse movement
                                              // "arrow" for arrow movements

let render_distance=2000;                     // Used on the greyscaling in LED.render();

let slider;
let last_fov=fov;

let minimap_width=300;
let minimap_height=300;

let bullet=[];
let bullet_LED=[];
let map_length;

function setup(){

  createCanvas(windowWidth,windowHeight-10);
  background(background_color);

  // ----------       -----------
  // |         |_____|          |
  // |     ____     _      -----
  // |    |    |   | |    |
  // -----     -----------

  // The map[] must contain the points of the vertices of every wall
  // in the for of [x1,y1,x2,y2]
  map_walls=[[0,0,1000,0],
       [1000,0,1000,250],
       [1000,250,2000,250],
       [2000,250,2000,0],
       [2000,0,3000,0],
       [3000,0,3000,500],
       [3000,500,2100,500],
       [2100,500,2100,1000],
       [2100,1000,1000,1000],
       [1000,1000,1000,500],
       [1000,500,700,500],
       [700,500,700,1000],
       [700,1000,0,1000],
       [0,1000,0,0],
       // Square
       [1200,600,1400,600],
       [1400,600,1400,800],
       [1400,800,1200,800],
       [1200,800,1200,600],
       // Cross
       [1700,600,1900,800],
       [1900,600,1700,800],
       // Triangle
       [2700,100,2700,400],
       [2700,400,2200,250],
       [2200,250,2700,100],
       // Oculus
       [175,400,550,400],
       [550,400,575,425],
       [575,425,575,575],
       [575,575,550,600],
       [550,600,450,600],
       [450,600,363,500],
       [363,500,275,600],
       [275,600,175,600],
       [175,600,150,575],
       [150,575,150,425],
       [150,425,175,400]];

  map_length=map_walls.length;

  for(let i=0;i<map_walls.length;i++){
    wall[i]=new Wall(map_walls[i][0],map_walls[i][1],map_walls[i][2],map_walls[i][3]);
  }

  light=new LED();

  slider = createSlider(1, 360, 45);
  slider.position(20, height-20);
  slider.style('width', '100px');

}

function draw(){

  last_fov=slider.value();
  if(last_fov!=fov){
    fov=last_fov;
    update_fov(light,fov);
  }

  background(background_color);

  if(camera_mode=="arrow"){
    if(keyIsDown(LEFT_ARROW)){
      update_light_dir_arrow(light,"l");
    }
    else if (keyIsDown(RIGHT_ARROW)) {
      update_light_dir_arrow(light,"r");
    }
  }
  else if (camera_mode=="mouse") {
    update_light_dir(light);
  }

  // Updating the bullet position
  if(bullet.length>0){
    bullet[0].update();
  }

  for(let i=0;i<wall.length;i++){
    light.collision(wall[i],i);
  }

  if (keyIsDown(87)) {
    key_pressed("w");
  }
  if (keyIsDown(83)) {
    key_pressed("s");
  }
  if (keyIsDown(65)) {
    key_pressed("a");
  }
  if (keyIsDown(68)) {
    key_pressed("d");
  }

  if(light.is_jumping==true){
    update_jump(light);
  }

  // First Rendering: Background walls
  if(bullet_LED.length>0){
    light.render("Wall",bullet_LED[0]);
  }
  else{
    light.render("Wall");
  }
  light.render_minimap(wall);

  // Collision with the bullet to determine its rendering
  if(bullet.length>0){
    bullet_LED[0].update_bullet_pos(bullet[0]);
    light.collision(bullet[0],wall.length);
    light.render("bullet");
    // bullet_LED[0].collision(bullet[0],0);
    // destroy_bullet(bullet_LED);
    // console.log("Bullet_LED: ",bullet_LED);
  }

  reset(light);

}

function key_pressed(key) {
  let step=5;
  let index=floor(light.ray.length/2)+1;            //Index of the central position of light.ray

  let angle_between=light.ray[index].heading();
  let vec;

  switch (key) {
    case 'w':
      if(light.able_move[0]){
        light.pos.x+=step*light.ray[index].x;
        light.pos.y+=step*light.ray[index].y;
      }
      break;
    case 's':
      if(light.able_move[1]){
        light.pos.x+=-step*light.ray[index].x;
        light.pos.y+=-step*light.ray[index].y;
      }
      break;
    case 'a':
      if(light.able_move[2]){
        angle=angle_between+radians(90);
        vec=p5.Vector.fromAngle(angle,1);
        light.pos.x+=-step*vec.x;
        light.pos.y+=-step*vec.y;
      }
      break;
    case 'd':
      if(light.able_move[3]){
        angle=angle_between-radians(90);
        vec=p5.Vector.fromAngle(angle,1);
        light.pos.x+=-step*vec.x;
        light.pos.y+=-step*vec.y;
      }
      break;
  }

}

function keyPressed() {
  if (keyCode ==32) {

    if(light.is_jumping==false){
      light.vy=10;
    }

    light.is_jumping=true;

  }
}

function mouseClicked() {

  // Bullet will be made of two objects: A boundary and an LED. Both movable
  // The LED will be used for the light emission
  // The boundary for the drawing or not of the Bullet

  let size=20;               //Size of the particle
  let far=100;               //How far from player it will be initialized

  let x_aux=light.pos.x+far*cos(-light.d_ang);
  let y_aux=light.pos.y-far*sin(-light.d_ang);

  let x_1=x_aux+sin(-light.d_ang)*size/2;
  let y_1=y_aux+cos(-light.d_ang)*size/2;
  let x_2=x_aux-sin(-light.d_ang)*size/2;
  let y_2=y_aux-cos(-light.d_ang)*size/2;

  // if(wall.length==map_length){
  //   wall.push(new Wall(x_1,y_1,x_2,y_2,light.d_ang));
  // }
  // else{
  //   wall[map_walls.length]=new Wall(x_1,y_1,x_2,y_2,light.d_ang);
  // }

  if(bullet.length<=1){
    bullet[0]=new Wall(x_1,y_1,x_2,y_2,light.d_ang);
    bullet_LED[0]= new LED();
  }
  else{
    bullet[bullet.length-1]=new Wall(x_1,y_1,x_2,y_2,light.d_ang);
    bullet_LED[bullet.length-1]= new LED();
  }

}

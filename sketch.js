// 04/01/2020 Lauro França
// Ray casting from the mouse position to all the wall lines


// Need to implement the jumping mechanics

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
       [1000,500,500,500],
       [500,500,500,1000],
       [500,1000,0,1000],
       [0,1000,0,0],
       [1400,600,1600,600],
       [1600,600,1600,800],
       [1600,800,1400,800],
       [1400,800,1400,600],
       [2700,100,2700,400],
       [2700,400,2200,250],
       [2200,250,2700,100]];

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
    light.update_fov();
  }

  background(background_color);


  if(camera_mode=="arrow"){
    if(keyIsDown(LEFT_ARROW)){
      light.update_light_dir_arrow("l");
    }
    else if (keyIsDown(RIGHT_ARROW)) {
      light.update_light_dir_arrow("r");
    }
  }
  else if (camera_mode=="mouse") {
    light_update=light.update_light_dir();
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

  light.render();
  light.render_minimap(wall);

  light.reset();

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

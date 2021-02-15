// 04/01/2020 Lauro França
// Ray casting from the mouse position to all the wall lines

let wall=[];
let light;

let n_rays=1200;
let fov=45;                           // FOV in degrees

let camera_mode="arrow";                      // "mouse" for mouse movement
                                              // "arrow" for arrow movements
let max_distance_ever;                        // Used on the greyscaling in LED.render();

let slider;
let last_fov=fov;

function setup(){

  createCanvas(windowWidth,windowHeight-10);
  background(20);

  // 0-3 reserved for outer walls
  wall[0]=new Wall(0,0,0,height);
  wall[1]=new Wall(width,0,width,height);
  wall[2]=new Wall(0,0,width,0);
  wall[3]=new Wall(0,height,width,height);

  wall[4]=new Wall(width/4,height/4,width/4,3*height/4);
  wall[5]=new Wall(width/4,height/4,width/2,height/4);
  wall[6]=new Wall(width/4,3*height/4,width/2,3*height/4);
  wall[7]=new Wall(random(width),random(height),random(width),random(height));
  wall[8]=new Wall(random(width),random(height),random(width),random(height));

  light=new LED();

  max_distance_ever=max(sqrt(width**2+height**2));

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

  background(20);

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
      light.pos.x+=step*light.ray[index].x;
      light.pos.y+=step*light.ray[index].y;
      break;
    case 's':
      light.pos.x+=-step*light.ray[index].x;
      light.pos.y+=-step*light.ray[index].y;
      break;
    case 'a':
      angle=angle_between+radians(90);
      vec=p5.Vector.fromAngle(angle,1);
      light.pos.x+=-step*vec.x;
      light.pos.y+=-step*vec.y;
      break;
    case 'd':
      angle=angle_between-radians(90);
      vec=p5.Vector.fromAngle(angle,1);
      light.pos.x+=-step*vec.x;
      light.pos.y+=-step*vec.y;
      break;
  }

}

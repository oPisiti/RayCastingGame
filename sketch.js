// 04/01/2020 Lauro França
// Ray casting from the mouse position to all the wall lines

let wall=[];
let light;

let n_rays=1000;
let fov=45;                           //FOV in degrees

function setup(){

  createCanvas(windowWidth,windowHeight);
  background(20);

  // 0-3 reserved for outer walls
  wall[0]=new Wall(0,0,0,height);
  wall[1]=new Wall(width,0,width,height);
  wall[2]=new Wall(0,0,width,0);
  wall[3]=new Wall(0,height,width,height);

  wall[4]=new Wall(width/2+250,height/2-50,width/2+150,height/2+50);
  wall[5]=new Wall(width/2-250,height/2,width/2+150,200);
  wall[6]=new Wall(random(width),random(height),random(width),random(height));
  wall[7]=new Wall(random(width),random(height),random(width),random(height));

  light=new LED();

}

function draw(){

  background(20);

  if (keyIsDown(87)) {
    key_pressed("w");
  }
  else if (keyIsDown(83)) {
    key_pressed("s");
  }
  else if (keyIsDown(65)) {
    key_pressed("a");
  }
  else if (keyIsDown(68)) {
    key_pressed("d");
  }

  light.update_light_dir();

  for(let i=0;i<wall.length;i++){
    light.collision(wall[i]);
  }

  light.render();
  light.render_minimap(wall);

  light.reset();

  // noLoop();


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

// 04/01/2020 Lauro França
// Ray casting from the mouse position to all the wall lines

let wall=[];
let light;

let n_rays=2500;

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

  light.update_light_dir();

  for(let i=0;i<wall.length;i++){
    wall[i].render();
    light.collision(wall[i],n_rays);
  }

  light.render_ray();
  light.render();

  light.reset();

}

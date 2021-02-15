function update_jump(l){
  l.vy-=l.g;
  l.y+=l.vy;

  if(l.y<=height/2){
    l.y=height/2;
    l.is_jumping=false;
  }

}

function update_fov(l,fov){

  let angles_temp=[];
  let ray_temp=[];

  l.delta_ang=radians(fov/n_rays);

  for(let a=-radians(fov/2);a<=(radians(fov/2));a+=l.delta_ang){
    angles_temp.push(a);
  }

  for(let i=0;i<l.angles.length;i++){
    l.angles[i]=angles_temp[i];
  }


  for(let a=(-radians(fov/2)+l.d_ang);a<=(radians(fov/2)+l.d_ang+0.01);a+=l.delta_ang){
    ray_temp.push(p5.Vector.fromAngle(a,1));
  }

  for(let i=0;i<l.ray.length;i++){
    l.ray[i]=ray_temp[i];
  }

  let ray_player_collision_temp=[];
  let count=0;
  for(let a=l.d_ang;a<(l.d_ang+radians(360)-0.01);a+=radians(360/l.n_player_collision)){
    ray_player_collision_temp.push(p5.Vector.fromAngle(a,1));
    ray_player_collision_temp[count].z=a;
    l.ray_player_collision[count]=ray_player_collision_temp[count];
    count++;
  }

}

// This algorithm bases itself on minimum distances
// It needs to reset those in order to determine the minimum for that set of variables
function reset(l){

  for(let i=0;i<=l.ray.length;i++){
    l.point[i]=createVector(Infinity,Infinity);
  }

  for(let i=0;i<l.point_player_collision.length;i++){
    l.point_player_collision[i]=createVector(Infinity,Infinity);
    l.distance_player_collision[i]=null;
  }

  l.able_move=[true,true,true,true];

}

// Updates with mouse
function update_light_dir(l){

  let d=mouseX-width/2;                 //Distance from the center of the screen
  let sens=150;                         //Sensibility of the mouse
  l.d_ang=d/sens;


  let ray_temp=[];
  for(let a=(-radians(fov/2)+l.d_ang);a<=(radians(fov/2)+l.d_ang+0.01);a+=l.delta_ang){
    ray_temp.push(p5.Vector.fromAngle(a,1));
  }

  for(let i=0;i<l.ray.length;i++){
    l.ray[i]=ray_temp[i];
  }

  let ray_player_collision_temp=[];
  let count=0;
  for(let a=l.d_ang;a<(l.d_ang+radians(360)-0.01);a+=radians(360/l.n_player_collision)){
    ray_player_collision_temp.push(p5.Vector.fromAngle(a,1));
    ray_player_collision_temp[count].z=a;
    l.ray_player_collision[count]=ray_player_collision_temp[count];
    count++;
  }

}


// Updates with arrows
function update_light_dir_arrow(l,key){

  let d=radians(2);

  if(key=="l"){
    d*=(-1);
  }

  l.d_ang+=d;

  let ray_temp=[];
  for(let a=(l.d_ang-radians(fov/2));a<=(l.d_ang+radians(fov/2)+0.01);a+=l.delta_ang){
    ray_temp.push(p5.Vector.fromAngle(a,1));
  }

  for(let i=0;i<l.ray.length;i++){
    l.ray[i]=ray_temp[i];
  }

  let ray_player_collision_temp=[];
  let count=0;
  for(let a=l.d_ang;a<(l.d_ang+radians(360)-0.01);a+=radians(360/l.n_player_collision)){
    ray_player_collision_temp.push(p5.Vector.fromAngle(a,1));
    ray_player_collision_temp[count].z=a;
    l.ray_player_collision[count]=ray_player_collision_temp[count];
    count++;
  }

}

// Receives the LED object VECTOR of the Bullet
// function destroy_bullet(bull){
//
//   if(bull[0].able_move[0]==false){
//     let a=[];
//     return a;
//     // console.log("bull: ",bull);
//   }
//
// }

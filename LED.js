class LED{

  constructor(){

    this.pos=createVector(100,100);

    this.ray=[];
    this.angles=[];                   //Information on all the angles of the rays

    this.delta_ang=radians(fov/n_rays);

    this.point=[];                    //Contains all the intersection points. 1 for each ray
    this.distance=[];                 //Contains the distance from the light source and the respectivepoint
    this.which=[];                    //this.which contains the Information on which wall it hit

    let count_=0;
    for(let a=-radians(fov/2);a<=(radians(fov/2));a+=this.delta_ang){
      this.angles.push(a);
      this.ray.push(p5.Vector.fromAngle(a,1));
      this.point[count_]=createVector(Infinity,Infinity);
      this.distance[count_]=null;
      this.which[count_]=null;
      count_++;
    }

    this.d_ang=0;                   //Keep track of the angles on arrow update rectMode
                                    //See update_light_dir_arrow for more


    // PLAYER COLLISION WITH THE WALLS
    this.n_player_collision=16;
    this.ray_player_collision=[];
    this.distance_player_collision=[];
    this.point_player_collision=[];

    count_=0;
    for(let a=0;a<radians(360);a+=radians(360/this.n_player_collision)){
      this.ray_player_collision.push(p5.Vector.fromAngle(a,1));
      this.ray_player_collision[count_].z=a;                // z contains the angle in radians
      this.point_player_collision[count_]=createVector(Infinity,Infinity);
      this.distance_player_collision[count_]=null;
      count_++;
    }

    //             ['w','s','a','d']
    this.able_move=[true,true,true,true];

    this.y=height/2;                      //Implemented for the jump mechanic
    this.vy=0;
    this.g=1;
    this.is_jumping=false;

  }


  // Will receive a vector containing all of the boundaries
  collision(bound,index){

    let den;
    let num_t;
    let num_u;
    let t;
    let u;

    let x1=bound.v1_pos.x;
    let y1=bound.v1_pos.y;
    let x2=bound.v2_pos.x;
    let y2=bound.v2_pos.y;

    let x3=this.pos.x;
    let y3=this.pos.y;


    for(let i=0;i<this.ray.length;i++){

      let x4=this.ray[i].x+this.pos.x;
      let y4=this.ray[i].y+this.pos.y;

      den=(x1-x2)*(y3-y4)-(y1-y2)*(x3-x4);
      num_t=(x1-x3)*(y3-y4)-(y1-y3)*(x3-x4);
      num_u=(x1-x2)*(y1-y3)-(y1-y2)*(x1-x3);
      t=num_t/den;
      u=-num_u/den;

      if(t>=0 && t<=1 && u>=0){
        // The point collides
        let p_temp=createVector(x1+t*(x2-x1),y1+t*(y2-y1));

        if(p5.Vector.dist(this.pos, p_temp)<p5.Vector.dist(this.pos, this.point[i])){
          this.point[i]=p_temp.copy();
          this.distance[i]=(p5.Vector.dist(this.pos, p_temp));
          this.which[i]=index;
        }

      }

    }

    // Player collision calculations
    for(let i=0;i<this.ray_player_collision.length;i++){

      let x4=this.ray_player_collision[i].x+this.pos.x;
      let y4=this.ray_player_collision[i].y+this.pos.y;

      den=(x1-x2)*(y3-y4)-(y1-y2)*(x3-x4);
      num_t=(x1-x3)*(y3-y4)-(y1-y3)*(x3-x4);
      num_u=(x1-x2)*(y1-y3)-(y1-y2)*(x1-x3);
      t=num_t/den;
      u=-num_u/den;

      if(t>=0 && t<=1 && u>=0){
        // The point collides
        let p_temp=createVector(x1+t*(x2-x1),y1+t*(y2-y1));

        if(p5.Vector.dist(this.pos, p_temp)<p5.Vector.dist(this.pos, this.point_player_collision[i])){
          this.point_player_collision[i]=p_temp.copy();
          this.distance_player_collision[i]=(p5.Vector.dist(this.pos, p_temp));
        }

        let angle_forward=this.ray_player_collision[i].z-this.d_ang;

        // Determining which directions to block
        if(this.distance_player_collision[i]<20){
          if(angle_forward>(radians(-45)) && angle_forward<=radians(45)){
            this.able_move[0]=false;  //'w'
          }
          else if(angle_forward>(radians(180-45)) && angle_forward<=radians(180+45)){
            this.able_move[1]=false;  //'s'
          }
          else if(angle_forward>(radians(270-45)) && angle_forward<=radians(270+45)){
            this.able_move[2]=false;  //'a'
          }
          else if(angle_forward>(radians(90-45)) && angle_forward<=radians(90+45)){
            this.able_move[3]=false;  //'d'
          }
        }

      }

    }


  }

  // Main function on this project
  // the fov parameter will account for the whole screen
  // Will use this.angless: account for the angles
  // Will use this.distance: account for the distances from source to points
  render(what,...bull){                  //Determines if it is a wall or a bullet

    rectMode(CENTER);
    let w=map(n_rays,0,1500,100,0);     //width wall
    let h=1000;                         //height wall

    if(what=="bullet"){
      h*=1/7;
    }

    let n_skips=null;
    let count=0;
    let changes_wall=false;

    let last_x;
    let last_width;

    let please_render=true;

    push();
    noStroke();

    for(let i=0;i<this.angles.length;i++){
      let f=map(this.distance[i],0,render_distance,255,30);              //THIS IS THE DEFAULT DISTANCE TO THE FILL

      please_render=true;
      if(f<background_color){
        please_render=false;
      }

      if(please_render){
        let x=map(this.angles[i],-radians(fov/2),radians(fov/2),-50,width+50);                      //percentage of the width that represents x
        let w_dist=150/this.distance[i];                                        //The effect of the distance into the size

        // If the rays hit the bullet on the *second* casting, only render the Bullet
        // "bullet" means the second casting. It's objective is to determine the bullet's distances
        if(what=="bullet"){
          if(this.which[i]==(map_length)){
            fill(250);
            rect(x,this.y,w*w_dist,h*w_dist);
          }
        }
        else{
          // This means the first casting. It's objective is to determine the wall's distances

          // Determining the fill f depending on the distance from player to wall and bullet to Wall
          // The [0] is due to the ...bullet, which returns an array
          if(bull.length>0){
            let d=bull[0].pos.dist(this.point[i]);
            // f+=(d*1/10);
            f-=map(d,0,1000,0,150);
            fill(f);
          }
          else{                   //Determines the supposed light source in the beginning to avoid weird flicks when the first bullet comes along
            f=0;
          }

          fill(f);

          if(i>0 && this.which[i]!=this.which[i-1]){
            // CHANGES WALLS
            changes_wall=true;
            if(i<(this.angles.length-1)){
              n_skips=(last_width-w*w_dist/2)/(map(this.angles[i+1],-radians(fov/2),radians(fov/2),-50,width+50)-(x));
            }
          }
          else if (changes_wall==false) {
            last_x=x;
            last_width=w*w_dist;
          }

          if(changes_wall==false){
            rect(x,this.y,w*w_dist,h*w_dist);
          }

          if(changes_wall && count<n_skips){
            count++;
          }
          else if(changes_wall==true){
            push();
            fill(background_color);
            rect(x,this.y,w*w_dist,h*w_dist);
            changes_wall=false;
            count=0;
            pop();
          }

        }

      }

    }

    pop();

  }

  render_minimap(bound){

    let w=width/5;
    let h=height/5;

    push();

    stroke(200,0,0);

    // Renders player as a point
    let x_p=map(this.pos.x,0,width,0,w);
    let y_p=map(this.pos.y,0,height,0,h);
    // let x_p=map(this.pos.x,0,width,0,minimap_width);
    // let y_p=map(this.pos.y,0,height,0,minimap_height);
    point(x_p,y_p);

    // Renders the boundaries
    for(let i=0;i<bound.length;i++){
      let x1=map(bound[i].v1_pos.x,0,width,0,w);
      let y1=map(bound[i].v1_pos.y,0,height,0,h);
      let x2=map(bound[i].v2_pos.x,0,width,0,w);
      let y2=map(bound[i].v2_pos.y,0,height,0,h);
      line(x1,y1,x2,y2);
    }

    // Renders the rays
    for(let i=0;i<this.point.length;i++){
      let x_ps=map(this.point[i].x,0,width,0,w);
      let y_ps=map(this.point[i].y,0,height,0,h);
      line(x_p,y_p,x_ps,y_ps);
    }

    // Renders the player collision n_rays
    // for(let i=0;i<this.point_player_collision.length;i++){
    //   let x_ps=map(this.point_player_collision[i].x,0,width,0,w);
    //   let y_ps=map(this.point_player_collision[i].y,0,height,0,h);
    //
    //   stroke(0,255,0);
    //
    //   if(this.distance_player_collision[i]<100){
    //     stroke(0,0,100);
    //   }
    //   line(x_p,y_p,x_ps,y_ps);
    // }

    pop();

  }


  // Updating the LEd part of the bullet to the wall part of it
  // Will receive the Wall object of the bullet
  update_bullet_pos(bull_wall){

    let x_temp=(bull_wall.v1_pos.x+bull_wall.v2_pos.x)/2;
    let y_temp=(bull_wall.v1_pos.y+bull_wall.v2_pos.y)/2;

    this.pos.x=x_temp;
    this.pos.y=y_temp;

    // console.clear();
    // console.log("Bullet Position: ",this.pos);

  }

}

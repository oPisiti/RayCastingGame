class LED{

  constructor(){
    // (x3,y3)=(this.pos.x,this.pos.y)
    // (x4,y4)=(this.ray[i].x+this.pos.x,this.ray[i].y+this.pos.y)
    this.pos=createVector(width/2,height/2);

    this.ray=[];
    this.angles=[];                   //Information on all the angles of the rays
    this.delta_ang=radians(fov/n_rays);

    for(let a=-radians(fov/2);a<=(radians(fov/2));a+=this.delta_ang){
      this.angles.push(a);
      this.ray.push(p5.Vector.fromAngle(a,1));
    }

    this.point=[];                   //Contains all the intersection points. 1 for each ray
    for(let i=0;i<=n_rays;i++){
      this.point[i]=createVector(Infinity,Infinity);
    }

    this.distance=[];               //Contains the distance from the light source and the respectivepoint
    this.which=[];                  //this.which contains the Information on which wall it hit
    for(let i=0;i<this.point.length;i++){
      this.distance[i]=null;
      this.which[i]=null;
    }

    this.d_ang=0;                   //Keep track of the angles on arrow update rectMode
                                    // See update_light_dir_arrow for more

  }

  update_fov(){

    let angles_temp=[];
    let ray_temp=[];

    this.delta_ang=radians(fov/n_rays);

    for(let a=-radians(fov/2);a<=(radians(fov/2));a+=this.delta_ang){
      angles_temp.push(a);
    }

    for(let i=0;i<this.angles.length;i++){
      this.angles[i]=angles_temp[i];
    }

    for(let a=(-radians(fov/2)+this.d_ang);a<=(radians(fov/2)+this.d_ang+0.01);a+=this.delta_ang){
      ray_temp.push(p5.Vector.fromAngle(a,1));
    }

    for(let i=0;i<this.ray.length;i++){
      this.ray[i]=ray_temp[i];
    }

  }

  reset(){
    for(let i=0;i<=n_rays;i++){
      this.point[i]=createVector(Infinity,Infinity);
    }
  }


  // Updates with mouse
  update_light_dir(){
    let d=mouseX-width/2;              //Distance from the center of the screen
    let sens=150;                         //Sensibility of the mouse
    let d_ang=d/sens;

    let ray_temp=[];
    for(let a=(-radians(fov/2)+d_ang);a<=(radians(fov/2)+d_ang+0.01);a+=this.delta_ang){
      ray_temp.push(p5.Vector.fromAngle(a,1));
    }

    for(let i=0;i<this.ray.length;i++){
      this.ray[i]=ray_temp[i];
    }

  }


  // Updates with arrows
  update_light_dir_arrow(key){

    let d=radians(2);

    if(key=="l"){
      d*=(-1);
    }

    this.d_ang+=d;

    let ray_temp=[];
    for(let a=(-radians(fov/2)+this.d_ang);a<=(radians(fov/2)+this.d_ang+0.01);a+=this.delta_ang){
      ray_temp.push(p5.Vector.fromAngle(a,1));
    }

    for(let i=0;i<this.ray.length;i++){
      this.ray[i]=ray_temp[i];
    }

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

  }

  // Main function on this project
  // the fov parameter will account for the whole screen
  // Will use this.angless: account for the angles
  // Will use this.distance: account for the distances from source to points
  render(bound){
    rectMode(CENTER);
    let w=map(n_rays,0,1500,100,0);     //width wall
    let h=1000;                         //height wall

    let n_skips=null;
    let count=0;
    let changes_wall=false;

    let last_x;
    let last_width;

    push();
    noStroke();

    for(let i=0;i<this.angles.length;i++){
      let f=map(this.distance[i],0,max_distance_ever,255,30);
      fill(f);
      let x=map(this.angles[i],-radians(fov/2),radians(fov/2),-50,width+50);                      //percentage of the width that represents x
      let w_dist=150/this.distance[i];                                        //The effect of the distance into the size

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
        fill(f);
        rect(x,height/2,w*w_dist,h*w_dist);
      }

      if(changes_wall && count<n_skips){
        count++;
      }
      else if(changes_wall==true){
        push();
        fill(20);
        rect(x,height/2,w*w_dist,h*w_dist);
        changes_wall=false;
        count=0;
        pop();
      }


    }

    pop();

  }

  render_minimap(bound){
    let w=width/5;
    let h=height/5;

    push();
    stroke(200,0,0);
    for(let i=0;i<bound.length;i++){
      let x1=map(bound[i].v1_pos.x,0,width,0,w);
      let y1=map(bound[i].v1_pos.y,0,height,0,h);
      let x2=map(bound[i].v2_pos.x,0,width,0,w);
      let y2=map(bound[i].v2_pos.y,0,height,0,h);
      line(x1,y1,x2,y2);
    }

    let x_p=map(this.pos.x,0,width,0,w);
    let y_p=map(this.pos.y,0,height,0,h);
    point(x_p,y_p);

    for(let i=0;i<this.point.length;i++){

      let x_ps=map(this.point[i].x,0,width,0,w);
      let y_ps=map(this.point[i].y,0,height,0,h);
      line(x_p,y_p,x_ps,y_ps);

    }

    pop();

  }

}

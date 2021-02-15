class LED{

  constructor(){
    // (x3,y3)=(this.pos.x,this.pos.y)
    // (x4,y4)=(this.ray[i].x+this.pos.x,this.ray[i].y+this.pos.y)
    this.pos=createVector(width/2,height/2);

    this.ray=[];
    let delta_ang=radians(360/n_rays);
    for(let a=0;a<(radians(360)-0.00001);a+=delta_ang){
      this.ray.push(p5.Vector.fromAngle(a,1));
    }

    this.point=[];                   //Contains all the intersection points. 1 for each ray
    for(let i=0;i<n_rays;i++){
      this.point[i]=createVector(Infinity,Infinity);
    }

  }

  reset(){
    for(let i=0;i<n_rays;i++){
      this.point[i]=createVector(Infinity,Infinity);
    }
  }

  update_light_dir(n_rays){
    this.pos.x=mouseX;
    this.pos.y=mouseY;
  }

  // Will receive a vector containing all of the boundaries
  collision(bound,n_rays){

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
        }

      }

    }

  }




  render_ray(){
    push();
    stroke(255,100);
    strokeWeight(1);
    for(let i=0;i<this.ray.length;i++){
      line(this.pos.x,this.pos.y,this.point[i].x,this.point[i].y);
    }
    pop();
  }

  render(){
    push();
    stroke(255);
    strokeWeight(2);
    point(this.pos.x,this.pos.y);
    pop();
  }

}

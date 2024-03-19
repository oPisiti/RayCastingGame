class Wall{

  constructor(x1,y1,x2,y2,direction){   //direction: Perpendicular to the surface
    // Vertices
    this.v1_pos=createVector(x1,y1);
    this.v2_pos=createVector(x2,y2);

    this.dir=direction;
    this.vel=5;                          //Speed of the bullet

  }

  update(){

    let update_vel=p5.Vector.fromAngle(this.dir,this.vel);

    this.v1_pos.add(update_vel);
    this.v2_pos.add(update_vel);

  }

}

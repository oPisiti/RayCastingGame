class Projectile{

  constructor(pos,dir){
    let size=50;              //Size of the particle
    let far=50;               //How far from player it will be initialized

    this.v1_pos=p5.Vector.fromAngle(dir-radians(90),1);
    this.v2_pos=p5.Vector.fromAngle(dir+radians(90),1);

  }

  // render(){
  //
  //
  //
  // }


}

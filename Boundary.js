class Wall{

  constructor(x1,y1,x2,y2){
    this.v1_pos=createVector(x1,y1);
    this.v2_pos=createVector(x2,y2);

  }

  render(){
    push();
    stroke(200,100,0);
    strokeWeight(2);
    line(this.v1_pos.x,this.v1_pos.y,this.v2_pos.x,this.v2_pos.y);
    pop();
  }

}

/*
记得js坐标系y轴和平时相反啊啊啊啊！！！！
*/

var canvas_y = 1000;

//从angle随机制造randian
function fromAngleMakeRad(angle_min, angle_max) {
    let ran_min = angleToRadian(angle_min);
    let ran_max = angleToRadian(angle_max);
    return (Math.random() * (ran_max - ran_min) + ran_min);
}

//random
function makeRandom(min, max) {
    return (Math.random() * (max - min) + min);
}

//角度转换弧度
function angleToRadian(angle) {
    return 2 * Math.PI / 360 * angle;
}

//生成随机数
function makeRatio(flag) {
    let outPut;
    switch (flag) {
        case 0: {//(0.0,1.0]
            outPut = (Math.random() * 10 + 1) / 10
            break;
        }
        case 1: {//[0.3,0.7)
            outPut = (Math.random() * 40 + 30) / 100
            break;
        }
        case 2: {//(0.0,0.3]
            outPut = (Math.random() * 30 + 1) / 100
            break;
        }
        case 3: {//[0.7,1.0)
            outPut = (Math.random() * 30 + 70) / 100
            break;
        }
        default:
            break;
    }
    console.log("makeRatio:", outPut);
    return outPut;
}

//关节类     //相连的上一个关节,长度,半径,xy面上的角度,z轴参数,颜色
function Joint(preJoint, len, r, rad_xy, color, ratio) {
    this.name = 'Joint';
    this.preJoint = preJoint;
    this.ratio = ratio;
    this.color = color;
    this.rad_xy = rad_xy;//自定义角度规则:角度从x轴开始顺时针转
    this.len = len;
    this.r = (this.ratio + 0.5) * r;//注:cos()、sin()用的是弧度不是角度
    this.x = preJoint.x + (this.ratio *0.5* len+0.5*len) * Math.cos(rad_xy);
    this.y = preJoint.y + (this.ratio * 0.5 * len + 0.5 * len) * Math.sin(rad_xy);
    console.log(this.name,"Coordinate: ", this.x, this.y, this.ratio);
    this.drawJoint = function () {
        var canvas = document.getElementById("canvas");//画关节
        var pen = canvas.getContext("2d");
        pen.beginPath();
        pen.strokeStyle = this.color;
        pen.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        pen.moveTo(preJoint.x, preJoint.y);//连线
        pen.lineTo(this.x, this.y);
        pen.stroke();
    }
}

//头类
function Head(x, y) {
    this.x = x;
    this.y = y;
    this.r = 40;
    //this.ratio = makeRatio(0);
    this.color = 'green';
    this.drawJoint = function () {//画关节
        var canvas = document.getElementById("canvas");
        var pen = canvas.getContext("2d");
        pen.beginPath();
        pen.strokeStyle = this.color;
        pen.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        pen.stroke();
    }
}

//脖子类
function Neck(preJoint) {
    this.name = 'Neck';
    this.preJoint = preJoint;
    this.len = 60;
    this.r = 10;
    this.rad_xy = fromAngleMakeRad(30, 150);
    this.ratio = makeRatio(0);
    this.color = 'red';
    Joint.call(this, preJoint, this.len, this.r, this.rad_xy, this.color, this.ratio);
}

//肩膀类
function Shoulder(preJoint, ifLeft) {
    this.name = 'Shoulder';
    this.preJoint = preJoint;
    this.len = 60;
    this.r = 10;
    if (ifLeft) {
        this.rad_xy = fromAngleMakeRad(-60, 30);
    }
    else {
        this.rad_xy = fromAngleMakeRad(150, 240);
    }
    this.ratio = makeRatio(0);
    this.color = 'blue';
    Joint.call(this, preJoint, this.len, this.r, this.rad_xy, this.color, this.ratio);
}

//手肘类
function Elbow(preJoint) {
    this.name = 'Elbow';
    this.preJoint = preJoint;
    this.len = 150;
    this.r = 10;
    this.rad_xy = fromAngleMakeRad(0, 360);
    this.ratio = makeRatio(0);
    this.color = 'orange';
    Joint.call(this, preJoint, this.len, this.r, this.rad_xy, this.color, this.ratio);
}

//手腕类
function Wrist(preJoint) {
    this.name = 'Wrist';
    this.preJoint = preJoint;
    this.len = 150;
    this.r = 10;
    this.rad_xy = fromAngleMakeRad(0, 360);
    this.ratio = makeRatio(0);
    this.color = '#990099';
    Joint.call(this, preJoint, this.len, this.r, this.rad_xy, this.color, this.ratio);
}

//腰类
function Waist(preJoint) {
    this.name = 'Waist';
    this.preJoint = preJoint;
    this.len = 150;
    this.r = 8;
    this.color = '#22002C';
    this.rad_xy = fromAngleMakeRad(30, 150);
    this.ratio = makeRatio(0);
    Joint.call(this, preJoint, this.len, this.r, this.rad_xy, this.color, this.ratio);
}

//髋部中心类
function Hip_center(preJoint) {
    this.name = 'Hip_center';
    this.preJoint = preJoint;
    this.len = 30;
    this.r = 8;
    this.color = '#00CC10';
    this.rad_xy = fromAngleMakeRad(30, 150);
    this.ratio = makeRatio(0);
    Joint.call(this, preJoint, this.len, this.r, this.rad_xy, this.color, this.ratio);
}
//髋部类
function Hip(preJoint, rad_xy) {
    this.name = 'Hip';
    this.preJoint = preJoint;
    this.len = 50;
    this.r = 12;
    this.color = '#ACCF30';
    this.rad_xy = rad_xy;
    this.ratio = makeRatio(0);
    Joint.call(this, preJoint, this.len, this.r, this.rad_xy, this.color, this.ratio);
}

//膝盖类
function Knee(preJoint, ifLeft, ratio) {
    this.name = 'Knee';
    this.preJoint = preJoint;
    this.len = 200;
    this.r = 10;
    this.color = '#CC5010';
    if (ifLeft) {
        this.rad_xy = fromAngleMakeRad(-60, 210);
    }
    else {
        this.rad_xy = fromAngleMakeRad(-30, 240);
    }
    this.ratio = ratio;
    Joint.call(this, preJoint, this.len, this.r, this.rad_xy, this.color, this.ratio);
}

//脚踝类
function Ankle(preJoint) {
    this.name = 'Ankle';
    this.preJoint = preJoint;
    this.len = 195;
    this.r = 8;
    this.color = '#33EEAA';
    this.rad_xy = fromAngleMakeRad(0, 360);
    this.ratio = makeRatio(0);
    Joint.call(this, preJoint, this.len, this.r, this.rad_xy, this.color, this.ratio);
}


//People类
function People(flag) {
    let r_1 = 40, r_2 = 10;
    this.head = new Head(makeRandom(200, 800), makeRandom(100, 400));
    this.neck = new Neck(this.head);
    this.shoulder_R = new Shoulder(this.neck, 0);
    this.shoulder_L = new Shoulder(this.neck, 1);
    this.Elbow_R = new Elbow(this.shoulder_R);
    this.Elbow_L = new Elbow(this.shoulder_L);
    this.Wrist_R = new Wrist(this.Elbow_R);
    this.Wrist_L = new Wrist(this.Elbow_L);
    this.Waist = new Waist(this.neck);
    this.Hip_center = new Waist(this.Waist);
    let hip_rad_xy = fromAngleMakeRad(120, 240);
    this.Hip_R = new Hip(this.Hip_center, hip_rad_xy);
    this.Hip_L = new Hip(this.Hip_center, hip_rad_xy - angleToRadian(180));
    switch (flag) {
        case 0: {  //flag=0:站立
            let ratio_Knee_R = makeRatio(1);
            let ratio_Knee_L = makeRatio(1);
            this.Knee_R = new Knee(this.Hip_R, 0, ratio_Knee_R);
            this.Knee_L = new Knee(this.Hip_L, 1, ratio_Knee_L);
            this.Ankle_R = new Ankle(this.Knee_R);
            this.Ankle_L = new Ankle(this.Knee_L);
            break;
        }
        case 1: {//坐下

        }
    }
    this.drawPoint = function () {//画关节
        this.head.drawJoint();
        this.neck.drawJoint();
        this.shoulder_R.drawJoint();
        this.shoulder_L.drawJoint();
        this.Elbow_R.drawJoint();
        this.Elbow_L.drawJoint();
        this.Wrist_R.drawJoint();
        this.Wrist_L.drawJoint();
        this.Waist.drawJoint();
        this.Hip_center.drawJoint();
        this.Hip_R.drawJoint();
        this.Hip_L.drawJoint();
        this.Knee_R.drawJoint();
        this.Knee_L.drawJoint();
        this.Ankle_R.drawJoint();
        this.Ankle_L.drawJoint();


        console.log("people_drawPoint");
    }

}

//清空画布
function cleanCanvas() {
    var canvas = document.getElementById("canvas");
    var pen = canvas.getContext("2d");
    pen.clearRect(0, 0, canvas.width, canvas.height);
}


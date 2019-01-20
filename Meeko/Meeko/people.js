/*
记得js坐标系y轴和平时相反啊啊啊啊！！！！
*/

var canvas_y = 1000;

//从angle随机制造randian
function fromAngleMakeRad(angle_min, angle_max) {
    let ran_min = angleToRadian(angle_min);
    let ran_max = angleToRadian(angle_max);
    return (Math.random() * (ran_max * 10 - ran_min * 10) + ran_min * 10) / 10;
}

//random
function makeRandom(min, max) {
    return (Math.random() * (max - min + 1) + min);
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
    this.r = (this.ratio + 0.5) * r;  //r的范围: [ratio , ratio + 0.5]
    this.x = preJoint.x + (this.ratio * 0.7 * len + 0.3 * len) * Math.cos(rad_xy);//注:cos()、sin()用的是弧度不是角度
    this.y = preJoint.y + (this.ratio * 0.7 * len + 0.3 * len) * Math.sin(rad_xy);
    this.drawJoint = function () {
        var canvas = document.getElementById("canvas");//画关节
        var pen = canvas.getContext("2d");
        pen.beginPath();
        pen.strokeStyle = this.color;
        pen.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        pen.moveTo(preJoint.x, preJoint.y);//连线
        pen.lineTo(this.x, this.y);
        pen.stroke();
        console.log(this.name, "Coordinate: ", this.x, this.y, this.ratio, this.rad_xy);
    }
}

//头类
function Head(x, y) {
    this.x = x;
    this.y = y;
    this.r = 40;
    //this.ratio = makeRatio(0);
    this.color = '#DD6666';
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
    this.ratio = makeRatio(1);
    this.color = '#A07050';
    Joint.call(this, preJoint, this.len, this.r, this.rad_xy, this.color, this.ratio);
}

//肩膀类
function Shoulder(preJoint, ifLeft) {
    this.name = 'Shoulder';
    this.preJoint = preJoint;
    this.len = 60;
    this.r = 10;
    let x = makeRandom(1, 10);
    if (x > 2) {
        this.rad_xy = ifLeft ? fromAngleMakeRad(0, 30) : fromAngleMakeRad(150, 180);
    }
    else {
        this.rad_xy = ifLeft ? fromAngleMakeRad(-30, 0) : fromAngleMakeRad(180, 210);
    }
    this.ratio = makeRatio(1);
    this.color = '#905070';
    Joint.call(this, preJoint, this.len, this.r, this.rad_xy, this.color, this.ratio);
}

//手肘类
function Elbow(preJoint) {
    this.name = 'Elbow';
    this.preJoint = preJoint;
    this.len = 150;
    this.r = 10;
    let x = makeRandom(1, 10);
    if (x > 2) {
    this.rad_xy = fromAngleMakeRad(0, 180);
    }
    else {
        this.rad_xy = fromAngleMakeRad(180, 360);
    }
    this.ratio = makeRatio(0);
    this.color = '#9055A0';
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
    this.color = '#C090DD';
    Joint.call(this, preJoint, this.len, this.r, this.rad_xy, this.color, this.ratio);
}

//腰类
function Waist(preJoint) {
    this.name = 'Waist';
    this.preJoint = preJoint;
    this.len = 150;
    this.r = 8;
    this.color = '#60AA50';
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
    this.color = '#209020';
    this.rad_xy = fromAngleMakeRad(30, 150);
    this.ratio = makeRatio(1);
    Joint.call(this, preJoint, this.len, this.r, this.rad_xy, this.color, this.ratio);
}
//髋部类
function Hip(preJoint, rad_xy) {
    this.name = 'Hip';
    this.preJoint = preJoint;
    this.len = 50;
    this.r = 12;
    this.color = '#806020';
    this.rad_xy = rad_xy;
    this.ratio = makeRatio(1);
    Joint.call(this, preJoint, this.len, this.r, this.rad_xy, this.color, this.ratio);
}

//膝盖类
function Knee(preJoint, ifLeft, ratio, flag, flag_2) {
    this.name = 'Knee';
    this.preJoint = preJoint;
    this.len = 200;
    this.r = 10;
    this.color = '#AA8060';
    let x = makeRandom(1, 10);
    switch (flag) {
        case 0: {  //flag=0:站立
            if (x > 3) {
                this.rad_xy = ifLeft ? fromAngleMakeRad(30, 120) : fromAngleMakeRad(60, 150);
            }
            else {
                this.rad_xy = ifLeft ? fromAngleMakeRad(-60, 210) : fromAngleMakeRad(-30, 240);
            }
            break;
        }
        case 1: {//坐下/跪着or盘腿
            this.rad_xy = flag_2 ? fromAngleMakeRad(0, 180) : fromAngleMakeRad(180, 360);
            break;
        }
        default:
            break;
    }
    this.ratio = ratio;
    Joint.call(this, preJoint, this.len, this.r, this.rad_xy, this.color, this.ratio);
}

//脚踝类
function Ankle(preJoint, ifLeft, flag, flag_2) {
    this.name = 'Ankle';
    this.preJoint = preJoint;
    this.len = 195;
    this.r = 10;
    this.color = '#DDA090';
    //this.rad_xy = fromAngleMakeRad(0, 360);
    let knee_rad_xy = preJoint.rad_xy;
    switch (flag) {
        case 0: {  //flag=0:站立
            this.rad_xy = knee_rad_xy + fromAngleMakeRad(-45, 45);
            break;
        }
        case 1: {//坐下
            if (flag_2) {
                this.rad_xy = knee_rad_xy + ((knee_rad_xy > angleToRadian(90) && knee_rad_xy < angleToRadian(270)) ?
                    fromAngleMakeRad(-150, -45) : fromAngleMakeRad(45, 150));
            }
            else {
                this.rad_xy = knee_rad_xy + ((knee_rad_xy > angleToRadian(90) && knee_rad_xy < angleToRadian(270)) ?
        fromAngleMakeRad(-45, 0) : fromAngleMakeRad(0, 45));
            }
            break;
        }
        case 2: {//跪着or盘腿
            this.rad_xy = knee_rad_xy + (ifLeft ? fromAngleMakeRad(120, 180) : fromAngleMakeRad(-120, -180));
            break;
        }
        default:
            break;
    }
    this.ratio = makeRatio(0);
    Joint.call(this, preJoint, this.len, this.r, this.rad_xy, this.color, this.ratio);
}


//People类
function People(flag) {
    let r_1 = 40, r_2 = 10;
    this.head = new Head(makeRandom(200, 600), makeRandom(100, 500));
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
            this.Knee_R = new Knee(this.Hip_R, 0, ratio_Knee_R, flag, 0);
            this.Knee_L = new Knee(this.Hip_L, 1, ratio_Knee_L, flag, 0);
            this.Ankle_R = new Ankle(this.Knee_R, 0, flag, 0);
            this.Ankle_L = new Ankle(this.Knee_L, 1, flag, 0);
            break;
        }
        case 1: {//坐下
            let x = makeRandom(1, 10);
            let y = makeRandom(1, 10);
            let z = makeRandom(1, 10);
            let ratio_Knee_R;
            let ratio_Knee_L;
            if (x > 6) {
                ratio_Knee_R = makeRatio(2);
                ratio_Knee_L = makeRatio(2);
            }
            else {
                ratio_Knee_R = makeRatio(3);
                ratio_Knee_L = makeRatio(3);
            }
            let ankle_flag_2 = (y > 2) ? 1 : 0;
            let knee_flag_2 = (z > 6) ? 1 : 0;
            this.Knee_R = new Knee(this.Hip_R, 0, ratio_Knee_R, flag, knee_flag_2);
            this.Knee_L = new Knee(this.Hip_L, 1, ratio_Knee_L, flag, knee_flag_2);
            this.Ankle_R = new Ankle(this.Knee_R, 0, flag, ankle_flag_2);
            this.Ankle_L = new Ankle(this.Knee_L, 1, flag, ankle_flag_2);
            break;
        }
        case 2: {//跪着or盘腿
            let ratio_Knee_R = makeRatio(0);
            let ratio_Knee_L = makeRatio(0);
            this.Knee_R = new Knee(this.Hip_R, 0, ratio_Knee_R, 1, 0);
            this.Knee_L = new Knee(this.Hip_L, 1, ratio_Knee_L, 1, 0);
            this.Ankle_R = new Ankle(this.Knee_R, 0, flag, 0);
            this.Ankle_L = new Ankle(this.Knee_L, 1, flag, 0);
            break;
        }
        default:
            break;
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


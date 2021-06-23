//
//衝突判定プラグイン
//

// line1 と line2 が交差しているかを調べる
// ただし、線分が重なっている場合(3点,4点が一直線上にある)、「交差している」、と判定します。
//
// line1 x1,y1（始点p1） x2,y2（終点p2）
// line2 x1,y1（始点p3） x2,y2（終点p4）
function hittest_line2line( line1, line2 )
{
	var S,T,D;	//	一時変数を宣言

	//	分母を先に計算。計算量を減らすため、分子は後で行う。
	D = (line2.x1-line1.x1) * (line2.y2-line1.y1) - (line2.y1-line1.y1) * (line2.x2-line1.x1);
	
	//	D の符号に応じて分岐
	if(D < 0){
		S = (line2.y2-line1.y1)*(line1.x2-line1.x1) - (line2.x2-line1.x1)*(line1.y2-line1.y1)
		T = (line2.x1-line1.x1)*(line1.y2-line1.y1) - (line2.y1-line1.y1)*(line1.x2-line1.x1)
		
		return S <= 0 && T <= 0 && (S+T)/D >= 1 ;
	}
	else if(D > 0){
		S = (line2.y2-line1.y1)*(line1.x2-line1.x1) - (line2.x2-line1.x1)*(line1.y2-line1.y1)
		T = (line2.x1-line1.x1)*(line1.y2-line1.y1) - (line2.y1-line1.y1)*(line1.x2-line1.x1)
		
		return S >= 0 && T >= 0 && (S+T)/D >= 1 ;
	}

	//	D = 0 の時には、点が線分の上かどうかを判定する。
	return (line2.x1-line1.x1)*(line2.x2-line1.x1)+(line2.y1-line1.y1)*(line2.y2-line1.y1) <= 0
		|| (line2.x1-line1.x2)*(line2.x2-line1.x2)+(line2.y1-line1.y2)*(line2.y2-line1.y2) <= 0
		|| (line1.x1-line2.x1)*(line1.x2-line2.x1)+(line1.y1-line2.y1)*(line1.y2-line2.y1) <= 0;
}


//enchant.Entity.prototype.hittest_line2line = hittest_line2line;

// 直線line と矩形
// 線分     line  x1, y1  x2,y2 
// 矩形領域 box   x1, y1  x2,y2
// lineは始点x1,y1 終点 x2,y2
// boxは左上x1,y1 右下x2,y2に正規化されてる必要がある
//

function hittest_line2box( line, box )
{
	//包含判定
	if( box.x1 < line.x1 && line.x1 < box.x2 && box.x1 < line.x2 && line.x2 < box.x2 ){
		if( box.y1 < line.y1 && line.y1 < box.y2 && box.y1 < line.y2 && line.y2 < box.y2 )return true;
	}
	
	var line2 = Object();
	//上辺
	line2.x1 = box.x1;	line2.y1 = box.y1;
	line2.x2 = box.x2;	line2.y1 = box.y1;
	if( hittest_line2line( line, line2 ) )return true;
	//下辺
	line2.x1 = box.x1;	line2.y1 = box.y2;
	line2.x2 = box.x2;	line2.y1 = box.y2;
	if( hittest_line2line( line, line2 ) )return true;
	//左辺
	line2.x1 = box.x1;	line2.y1 = box.y1;
	line2.x2 = box.x1;	line2.y1 = box.y2;
	if( hittest_line2line( line, line2 ) )return true;
	//右辺
	line2.x1 = box.x2;	line2.y1 = box.y1;
	line2.x2 = box.x2;	line2.y1 = box.y2;

	if( hittest_line2line( line, line2 ) )return true;
	return false;
}
//enchant.Entity.prototype.hittest_line_box = hittest_line2box;

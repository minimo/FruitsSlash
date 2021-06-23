/*

	FruitsSlash
	2011/10/25

*/

enchant();

window.onload = function() {
	var game = new Game( 320, 320 );
	game.fps = 30;
	var sec = function( time ){ return Math.floor( game.fps * time ); }

	game.preload('icon0.gif', 'chara1.gif', 'font.png');

	game.onload = function(){
		//環境変数
		/////////////////////////////////////////////////////////////////////////////
		var level = 1;	//ゲームレベル
		var score = 0;	//スコア

		var combo = false;	//コンボフラグ
		var comboCount = 0;	//コンボカウンタ
		var beforeItem = 0;
		var beforeFrame = 0;

		var touch = false;
		var startX, startY;
		var endX, endY;

		var nextF = 60;
		var next = 30;

		var lefttime = 30;

		//ステージ準備
		/////////////////////////////////////////////////////////////////////////////
		stage = new Group();
		game.rootScene.addChild( stage );
		game.rootScene.backgroundColor = "#000000";

		//ターゲット準備
		/////////////////////////////////////////////////////////////////////////////
		var numTargets = 10;
		var targets = new Array( numTargets );
		for( i = 0; i < numTargets; i++ ){
			targets[i] = new Sprite( 16, 16 );
			targets[i].image = game.assets['icon0.gif'];
			targets[i].frame = 0;
			targets[i].rotation = Math.floor(Math.random() * 360);
			targets[i].rotV = Math.floor(Math.random() * 6) - 3;
			targets[i].scaleX = 4;
			targets[i].scaleY = 4;
			targets[i].x = -100;
			targets[i].y = -100;
			targets[i].vx = 0;
			if (targets[i].x > game.width / 2) targets[i].vx *= -1;
			targets[i].F = Math.floor(Math.random() * 5) + 18;
			targets[i].yPrev = game.height;
			targets[i].visible = false;
			targets[i].slash = false;	//切られたフラグ
			targets[i].drop = true;		//落ちたフラグ
			targets[i].num = i;			//通し番号
			targets[i].item = 0;		//種別
			targets[i].addEventListener('enterframe', function() {
				if( this.visible ){
					var yTemp = this.y;
					var yTemp2 = (this.yPrev - this.y) + this.F;
					this.y -= yTemp2;
					this.F = -1;
					this.yPrev = yTemp;
					this.x += this.vx;
					if( this.y > game.height ){
						y = -100;
						this.visible = false;
						this.drop = true;
					}
//					this.rotation += this.rotV;
				}
			}); //target.enterFrame
			stage.addChild(targets[i]);
		}

		//スコア表示
		/////////////////////////////////////////////////////////////////////////////
		var scoreLabel = new Label( "SCORE : " + score );
		scoreLabel.x = 5;
		scoreLabel.y = 5;
		scoreLabel.color = "#ffffff";
		scoreLabel.font = "bold";
		game.rootScene.addChild( scoreLabel );

		//スコア表示
		/////////////////////////////////////////////////////////////////////////////
		var timeLabel = new Label( "TIME : " + lefttime );
		timeLabel.x = 250;
		timeLabel.y = 5;
		timeLabel.color = "#ffffff";
		timeLabel.font = "bold";
		game.rootScene.addChild( timeLabel );

		//バックグラウンド
		/////////////////////////////////////////////////////////////////////////////
//		back = new Sprite( game.width, game.height );
//		back.image = game.assets['back.jpg'];
//		game.rootScene.addChild( back );

		//ステージ進行
		/////////////////////////////////////////////////////////////////////////////
		stage.addEventListener('enterframe', function() {
			next--;
			if( next < 0 ){
				for( i = 0; i < level; i++ ){
					throwTarget( i );
				}
				next = nextF;
				level++;
				if( level > 5 )level = 5;
			};

			//時間管理
			if( game.frame % game.fps == 0 ){
				lefttime--;
			}
			if( lefttime <= 0 ){
				lefttime = 0;

				//ターゲットが全て落ちたら終了する
				count = 0;
			    for( i = 0; i< numTargets; i++ ){
					if( !targets[i].drop )count++;
				}
			    if( count == 0 ){
					game.end( score, "SCORE " + score );
				}
			}
			timeLabel.text = "TIME : " + lefttime;
		}); //stage.enterFrame

        //投げ込みくま投入
		/////////////////////////////////////////////////////////////////////////////
        var enterEnemy = function(){
        };

		//フルーツ投げ込み
		/////////////////////////////////////////////////////////////////////////////
		var throwTarget = function( num ){
//			targets[num].frame = Math.floor(Math.random() * 4) + 15;
			dice = Math.floor(Math.random() * 6);
			if( dice == 0 )targets[num].frame = 15;	//りんご
			if( dice == 1 )targets[num].frame = 16;	//バナナ
			if( dice == 2 )targets[num].frame = 17;	//ブドウ
			if( dice == 3 )targets[num].frame = 18;	//メロン
			if( dice == 4 )targets[num].frame = 28;	//パイン
			if( dice == 5 )targets[num].frame = 32;	//いちご
			if( dice == 6 )targets[num].frame = 34;	//時計
			if( dice == 7 )targets[num].frame = 30;	//スター
			if( dice == 8 )targets[num].frame = 24;	//爆弾
			targets[num].item = dice;

			targets[num].rotation = Math.floor(Math.random() * 360);
			targets[num].rotV = Math.floor(Math.random() * 6) - 3;
			targets[num].x = Math.floor(Math.random() * game.width - 40) + 20;
			targets[num].y = game.height;
			targets[num].vx = Math.floor(Math.random() * 5) + 3;
			if (targets[num].x > game.width / 2) targets[num].vx *= -1;
			targets[num].F = Math.floor(Math.random() * 5) + 18;
			targets[num].yPrev = game.height;
			targets[num].visible = true;
			targets[num].slash = false;
			targets[num].drop = false;
		};

		//斬撃エフェクト
		/////////////////////////////////////////////////////////////////////////////
		var slashEffect = function( x1, y1, x2, y2 ){
			//画面上の位置と大きさ取得
			if( x1 < x2 )x = x1; else x = x2;
			if( y1 < y2 )y = y1; else y = y2;
			w = Math.abs( x2 - x1 )+20;
			h = Math.abs( y2 - y1 )+20;

			var ef_line = new Sprite( w, h );
			ef_line.time = 0;
			ef_line.x = x-10;	//描画領域
			ef_line.y = y-10;	//描画領域
			ef_line.x1 = x1-x+10;	ef_line.y1 = y1-y+10;	//始点
			ef_line.x2 = x2-x+10;	ef_line.y2 = y2-y+10;	//終点
			ef_line.lineWidth = 1;

			ef_line.image = new Surface( w, h );
			ef_line.image.context.beginPath();
			ef_line.image.context.lineWidth = 1;
			ef_line.image.context.globalAlpha = 0.8;
			ef_line.image.context.clearRect( 0, 0, ef_line.width, ef_line.height );
			ef_line.image.context.strokeStyle = 'rgb(51, 51, 255)';
			ef_line.image.context.moveTo( ef_line.x1, ef_line.y1 );
			ef_line.image.context.lineTo( ef_line.x2, ef_line.y2 );
			ef_line.image.context.stroke();

			ef_line.addEventListener('enterframe', function() {
				this.time++;
				if( this.time < 6 ) this.lineWidth+=2; else this.lineWidth-=4;
				this.image.context.beginPath();
				this.image.context.lineWidth = this.lineWidth;
				this.image.context.clearRect( 0, 0, this.width, this.height );
				this.image.context.moveTo( this.x1, this.y1 );
				this.image.context.lineTo( this.x2, this.y2 );
				this.image.context.stroke();
				if( this.time > 10 ){
					stage.removeChild( this );
					delete this.image;
					delete this;
				}
			});
			stage.addChild( ef_line );
 		};

		//直線とターゲットの当たり判定
		/////////////////////////////////////////////////////////////////////////////
		var targetHittest = function( target, line ){
			if( !target.visible )return false;
			var box = Object();
			box.x1 = target.x - 20;	box.y1 = target.y - 20;
			box.x2 = target.x + 20;	box.y2 = target.y + 20;
			if( hittest_line2box( line, box ) )return true;
			return false;
		}

		//当たり判定
		/////////////////////////////////////////////////////////////////////////////
		var slashCheck = function(){
			var line = Object();
		    for( i = 0; i< numTargets; i++ ){
				line.x1 = startX;	line.y1 = startY;
				line.x2 = endX;		line.y2 = endY;
				if( targetHittest( targets[i], line ) ){
					targets[i].visible = false;
					targets[i].slash = true;
					slashFruits( targets[i], line );
					score++;
					scoreLabel.text = "SCORE : " + score;
				}
			}
		}

		//フルーツ切断
		/////////////////////////////////////////////////////////////////////////////
		var slashFruits = function( item, line ){
			item.visible = false;
			//切断した角度の計算
			x = line.x2 - line.x1;
			y = line.y2 - line.y1;
			if( x != 0 ){
				k = y / x;
				at = Math.atan( k );
				deg = Math.floor(at * 180 / 3.14159);
				if( deg == NaN )deg = item.rotation;
				if( deg < 0 )deg += 360;
				if( Math.abs( item.rotation - deg ) > 180 )deg += 180;
			}else{
				deg = item.rotation
			}

			var t1 = new Sprite( 16, 8 );
			t1.image = game.assets['icon0.gif'];
			t1.frame = Math.floor( item.frame / 16 ) * 32 + item.frame % 16;
			t1.rotation = deg;
			t1.rotV = item.rotV;
			t1.scaleX = item.scaleX;
			t1.scaleY = item.scaleY;
			t1.x = item.x;
			t1.y = item.y;
			t1.vx = item.vx;
			t1.F = item.F;
			t1.yPrev = item.yPrev;
			t1.num = item.num;
			t1.addEventListener('enterframe', function() {
				var yTemp = this.y;
				var yTemp2 = (this.yPrev - this.y) + this.F;
				this.y -= yTemp2;
				this.F = -1;
				this.yPrev = yTemp;
				this.x += this.vx;
				if( this.y > game.height ){
					targets[this.num].drop = true;
					stage.removeChild( this );
					delete this;
				}
			});
			stage.addChild( t1 );

			var t2 = new Sprite( 16, 8 );
			t2.image = game.assets['icon0.gif'];
			t2.frame = Math.floor( item.frame / 16 ) * 32 + item.frame % 16 + 16;
			t2.rotation = deg;
			t2.rotV = item.rotV;
			t2.scaleX = item.scaleX;
			t2.scaleY = item.scaleY;
			t2.x = item.x;
			t2.y = item.y;
			t2.vx = -item.vx;
			t2.F = item.F;
			t2.yPrev = item.yPrev;
			t2.addEventListener('enterframe', function() {
				var yTemp = this.y;
				var yTemp2 = (this.yPrev - this.y) + this.F;
				this.y -= yTemp2;
				this.F = -1;
				this.yPrev = yTemp;
				this.x += this.vx;
				if( item.y > game.height ){
					stage.removeChild( this );
					delete this;
				}
			});
			stage.addChild( t2 );
		};

		//コンボチェック
		/////////////////////////////////////////////////////////////////////////////
		var comboCheck = function(){
			comboCount = 1;
			for( i1 = 0;i1 < numTargets; i1++ ){
				if( targets[i1] ){
					comboTemp = 1;
					for( i2 = 0;i2 < numTargets; i2++ ){
						if( i1 != i2 && targets[i2].slash && targets[i1].within( targets[i2], 16 ) ){
							comboTemp++;
							px = targets[i1].x;
							py = targets[i1].y;
						}
					}
				}
				if( comboTemp > comboCount )comboCount = comboTemp;
			}
			if( comboCount > 1 ){
				var cb1 = new MutableText( px - 64, py - 32, 300, comboCount + " COMBO!" );
				cb1.count = 20;
				cb1.addEventListener( 'enterframe', function() {
					this.y -= 1;
					this.count--;
					this.opacity -= 0.05;
					if( this.count == 0 )stage.removeChild( this );
				});
				stage.addChild( cb1 );
				score += comboCount * 2;
				lefttime += 2;
				scoreLabel.text = "SCORE : " + score;
			}
		    for( i = 0; i< numTargets; i++ )targets[i].slash = false;
		}

		//操作系
		/////////////////////////////////////////////////////////////////////////////
		game.rootScene.addEventListener('touchstart', function(e) {
			touch = true;
			startX = e.localX;
			startY = e.localY;
			startF = game.frame;
			endX = startX;
			endY = startY;
			comboCount = 0;
		});
		game.rootScene.addEventListener('touchmove', function(e) {
			endX = e.localX;
			endY = e.localY;

			slashEffect( startX, startY, endX, endY );
			slashCheck();
			if( game.frame - startF > 1 )comboCheck();	//コンボチェックは２フレーム毎
			startX = e.localX;
			startY = e.localY;
			startF = game.frame;
			
		});
		game.rootScene.addEventListener('touchend', function(e) {
			touch = false;
			endX = e.localX;
			endY = e.localY;

			//ラインを引く
			slashEffect( startX, startY, endX, endY );
			slashCheck();
			comboCheck();
		});
	};
	game.start();
};

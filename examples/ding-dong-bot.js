/**
 * Wechaty - Conversational RPA SDK for Chatbot Makers.
 *  - https://github.com/wechaty/wechaty
 */
const COS = require('cos-nodejs-sdk-v5');
const urlencode = require('urlencode');
let cos = new COS({
  SecretId: 'AKIDud5GBpCI7fwxgANJyMTJr88qHRKvGK7d',
  SecretKey: 'HI1UgbEbgU1HGyOXQ3QWMuBBuMWQ2Wjf',
});
const gameApi = 'https://api.tianapi.com/game/index';
const rainbowApi = 'https://api.tianapi.com/txapi/caihongpi/index';
const key = 'c5b5fd679301a335a1a9b40a1f41f731'
let { food, drink } = require('./config/food.js')
let fs = require('fs');
const https = require('https')
const { FileBox } = require('file-box')
const fileBox1 = FileBox.fromUrl('https://img0.baidu.com/it/u=4062059698,1996885113&fm=26&fmt=auto&gp=0.jpg')
const tool = `现已有如下功能：
 1. 打群成员名字可以看见我对他们的评价。
 2. 拍一拍我查看彩蛋（不要@我）。
 3. 输入”新建备忘 ：“来创建你的备忘录，输入”备忘录“查看你的备忘信息。
 4. 想恰饭？输入”上饭“。输入”+加饭“来增添新的菜品。
 5. 想喝饮料？输入”上饮料“。
 6. 查看图片请输入”涩图“。
 7. 艾特我输入夸夸，可以体验上等彩虹屁[旺柴]`
const {
  Wechaty,
  ScanStatus,
  log
} = require('wechaty');
const { weapon, penpenmode, fortunelable } = require('./config/fortune.js');
let flag = 0;


function onScan(qrcode, status) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    require('qrcode-terminal').generate(qrcode, { small: true })  // show qrcode on console

    const qrcodeImageUrl = [
      'https://wechaty.js.org/qrcode/',
      encodeURIComponent(qrcode),
    ].join('')

    log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)

  } else {
    log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
  }
}

function onLogin(user) {
  log.info('StarterBot', '%s login', user)
}

function onLogout(user) {
  log.info('StarterBot', '%s logout', user)
}


async function onMessage(msg) {
  let canUpload = false
  let leader = "Zhuozhuo";
  let person = "33";
  let talkman = msg.talker().name();
  log.info('StarterBot', msg)
  if (talkman === 'Omos') {
    // await msg.say('阿君')
    return
  }

  if (msg.self()){
    flag = 0;
    return;
  }

  if (msg.text() === '功能') {
    await msg.say(tool)
  }

  if (msg.text().includes('发图：')) {
    let pic = msg.text().slice(3)
    let imgSrc = 'https://penpen-1302021874.cos.ap-nanjing.myqcloud.com/' + urlencode(pic) + '.png';
    let img = FileBox.fromUrl(imgSrc) //默认png
    await msg.say(img)
    return;
  }

  //  if(upload && uploadman===talkman){
  //   if (msg.type() === bot.Message.Type.Image) {
  //     msg.say('已收到，开始上传')
  //     // 上传图片BOS
  //     let file = await msg.toFileBox();
  //     console.log(file)
  //     // let bsimg = await file.toBase64();
  // let client = new BosClient(config);
  // client.putObjectFromFile(bucket, filename, file)
  //   .then(response => {
  //     console.log(response);
  //     msg.say('上传成功啦~[庆祝][庆祝]')
  //   })    // 成功
  //   .catch(error => console.error(error));      // 失败

  //     uploadman = '';
  //     upload = false;
  //   }
  //   else{
  //     msg.say('请先发送图片再使用其他功能，不然别怪本乌不客气[发怒]')
  //   }
  //  }

  // 检查是哪个群
  if (msg.toString().includes('互联网')) {
    leader = "叫我阿琛";
    person = "狂阿弥";
  } else if (msg.toString().includes('贤者')) {
    leader = "不被宽恕的格里姆林";
    person = "配件";
  }

  if (msg.toString().includes('养鸽舍')) {
    canUpload = true;
  }

  if (msg.text().includes('上传图片')) {
    // if(uploadman){
    //   msg.say(`不要着急哦~等${uploadman}上传完图片再使用此功能吧~`)
    // }
    // filename = msg.text().slice(5);
    // upload = true;
    // uploadman = talkman;
    // await msg.say(`bot已处于准备状态，请${uploadman}开始上传文件名为${filename}的图片`)
    await msg.say("")
    return
  }

  // 记录备忘
  if (msg.text() === "备忘录") {
    fs.readFile(__dirname + '/note/' + talkman + 'note.txt', function (error, data) {
      if (error) {
        // 在这里就可以通过判断 error 来确认是否有错误发生
        console.log('读取文件失败了')
      } else {
        msg.say(data.toString())
      }
    })
  }

  if (msg.toString().includes('记录备忘：')) {
    let item = msg.text().slice(5);
    fs.appendFile(__dirname + '/note/' + talkman + 'note.txt', item, 'utf-8', function (error) {
      if (error) {
        msg.say('失败了，失败原因：' + error)
      } else {
        msg.say('记录成功，可回复"备忘录"查看哦~')
      }
    })
  }

  if (msg.toString().includes('新建备忘：')) {
    let item = msg.text().slice(5);
    fs.writeFile(__dirname + '/note/' + talkman + 'note.txt', item, 'utf-8', function (error) {
      if (error) {
        msg.say('失败了，失败原因：' + error)
      } else {
        msg.say('记录成功，可回复"备忘录"查看哦~')
      }
    })
  }

  if (msg.type() === 13) {
    recalled = await msg.toRecalled()
    await msg.say('哼哼哼，打错字了吧，我可是记录了呢！');
    return
  }

  // 上饭和上饮料功能
  if (msg.text() === '上饭') {
    let index = Math.floor((Math.random() * food.length));
    await msg.say(food[index])
    return
  }

  if (msg.text() === '上饮料') {
    let index = Math.floor((Math.random() * drink.length));
    await msg.say(drink[index])
    return
  }

  if (msg.text().includes('+加饭')) {
    let item = msg.text().slice(4);
    if (item == '') {
      await msg.say('啊咧咧，加什么饭，你倒是说清楚啊[发怒]')
      return
    }
    if (item.includes("勾八") || item.includes("几把") || item.includes("鸡巴") || item.includes("屎")) {
      await msg.say(`好的~，给${talkman}吃吧`)
      return
    }
    if (food.includes(item)) {
      await msg.say('加你个头，加过了都！')
      return
    }

    food.push(item)
    await msg.say(`好的，${talkman}加饭成功,正在放进菜谱~`);
    return
  }

  //运势功能
  if (msg.text() === '抽签') {
    let index1 = Math.floor((Math.random() * weapon.length));
    let index4 = Math.floor((Math.random() * weapon.length));
    let index2 = Math.floor((Math.random() * penpenmode.length));
    let index3 = Math.floor((Math.random() * fortunelable.length));
    await msg.say(`今日的喷喷运势如下：
      你抽到了${fortunelable[index3]}!
      你的幸运模式是${penpenmode[index2]}。
      你的幸运武器是${weapon[index1]}。
      今日禁忌武器${weapon[index4]}。
      乌贼bot祝你今天喷喷愉快！`
    );
    return
  }

  if (msg.toString().includes('拍了拍') && msg.toString().includes('我')) {
    let random = Math.random()
    if (random < 0.2) {
      await msg.say('你拍一，我拍一，群主都是大sb')
      return
    } else if (0.4 < random && random < 0.6) {
      await msg.say('拍我，给你两拳，活崽种！')
      return
    } else if (0.6 < random && random < 0.8) {
      await msg.say('再拍我就吃掉你！')
      return
    } else {
      await msg.say(`拍啥啊，有事找@${leader},不许拍我！`)
      return
    }
  }


  // if (msg.toString().includes('拍了拍')) {
  //   await msg.say('为什么不拍我！')
  //   return
  // }

  if (msg.toString().includes('帅') || msg.toString().includes('yyds') || msg.toString().includes('牛')) {
    await msg.say('谢谢夸奖~[害羞][愉快]')
    return
  }

  // if (msg.toString().includes('') || msg.toString().includes('心疼')) {
  //   await msg.say('不像我')
  //   await msg.say('我只会心疼giegie')
  //   return
  // }

  if (msg.text().includes('@') && msg.text().includes('bot')) {
    if (msg.text().includes('你好')) {
      await msg.say('你好你好[嘿哈]')
      return
    }
    if (msg.text().includes('游戏')) {
      https.get(gameApi + '?key=' + key, res => {
        console.log(`状态码: ${res.statusCode}`)
        let data = '';
        res.on('data', chunk => {
          data += chunk;
        })
        res.on('end', () => {
          data = JSON.parse(data)
          let { newslist } = data
          if (!newslist.length || !newslist) {
            msg.say('我词穷了hh');
            return
          }
          let gameList = '';
          newslist.forEach((item, index) => {
            gameList += `${+index + 1}、${item.title}
             ${item.description}<br>`
          });
          msg.say(gameList);
        })
      })
      return
    }
    if (msg.text().includes('夸夸')) {
      https.get(rainbowApi + '?key=' + key, res => {
        console.log(`状态码: ${res.statusCode}`)
        let data = '';
        res.on('data', chunk => {
          data += chunk;
        })
        res.on('end', () => {
          data = JSON.parse(data)
          let { newslist } = data
          if (!newslist.length || !newslist) {
            msg.say('我词穷了hh');
            return
          }
          msg.say(newslist[0].content);
        })
      })
      return
    }

    let random = Math.random()
    if (random < 0.2) {
      await msg.say('我在，你说[嘿哈]（回复"功能"可查看我的所有功能~）')
      return
    } else if (0.4 < random && random < 0.6) {
      await msg.say('再艾特就吃了你[发怒]')
      return
    } else if (0.6 < random && random < 0.8) {
      await msg.say('警告，即将启动自爆程序！⚠️')
      return
    } else {
      await msg.say(`阿巴阿巴？@${person} 你找他玩去！[机智]`)
      return
    }
  }

  if (msg.text().indexOf("小黑") !== -1 || msg.text().indexOf("鹿鹿") !== -1 || msg.text().indexOf("初初") !== -1) {
    await msg.say('可可爱爱')
    if (msg.toString().indexOf('233') !== -1) {
      await msg.say('33是渣男')
      return
    }
    return
  }

  if (msg.text().includes('fifi')) {
    let random = Math.random()
    if (random < 0.2) {
      await msg.say('fifi子！坏女人！')
      return
    } else if (0.4 < random && random < 0.6) {
      await msg.say('fifi听了后生气的把任天堂买了下来[偷笑]')
      return
    } else if (0.6 < random && random < 0.8) {
      await msg.say('哼，坏吕人！')
      return
    } else {
      await msg.say(`不会吧不会吧，fifi子怎么还没起床`)
      return
    }
  }

  if (msg.text().includes('你的下一句话是')) {
    await msg.say('kono dio da ，jojo![发怒]')
    return
  }
  if (msg.text().includes('violet') || msg.text().includes('三月末')) {
    await msg.say('有趣的女人[悠闲]')
    return
  }

  if (msg.text().includes('小铭')) {
    await msg.say('哦多桑，只有红茶可以吗🍵')
    return
  }


  if (msg.text() === '今天的名言是') {
    await msg.say('zhuozhuo大笨蛋')
    return
  }
  if (msg.toString().indexOf('233') !== -1) {
    await msg.say('渣男')
    return
  }
  if (msg.toString().indexOf('ba') !== -1) {
    let random = Math.random()
    if (random < 0.2) {
      await msg.say('ba还没下班嘻嘻')
      return
    } else if (0.4 < random && random < 0.6) {
      await msg.say('ba去玩了')
      return
    } else if (0.6 < random && random < 0.8) {
      await msg.say('一个4399神秘男人，据说你们冲的钱都在他那~[旺柴]')
      return
    } else {
      await msg.say(`左右左右，baba`)
      return
    }

  }
  if (msg.toString().indexOf('小满') !== -1) {
    let random = Math.random()
    let index = Math.floor((Math.random() * food.length));
    if (random < 0.2) {
      await msg.say('小满睡着了，真是🐷！')
      return
    } else if (0.4 < random && random < 0.6) {
      await msg.say('小满在爱丽丝仙境里梦游呢~')
      return
    } else if (0.6 < random && random < 0.8) {
      await msg.say('[旺柴]小满正在烹饪中，做的饭是' + food[index])
      return
    } else {
      await msg.say(`是逃脱魔仙堡的仙女！（黑魔法`)
      return
    }
  }
  if (msg.text().includes('喷喷') || msg.text().includes('排排') || msg.text().includes('打喷')) {
    await msg.say('@所有人 出来四排！')
    return
  }
  if (msg.text().includes('打工')) {
    await msg.say('@所有人 出来打gong！坑比熊老板还我血汗钱！')
    return
  }
  if (msg.text().indexOf("zhuozhuo") !== -1) {
    // await msg.type
    await msg.say('他是头猪')
    return
  }

  if (msg.text().includes('上号')) {
    await msg.say('@所有人 开机啦崽种们！给你两拳！')
    return
  }

  if (msg.text().includes('鲍勃')) {
    await msg.say('从事俄罗斯热狗销售行业的知名硕士')
    return
  }

  if (msg.text().includes('东北大拉皮')) {
    await msg.say('你爱我，我爱你，我们都爱吃大拉皮~')
    return
  }

  if (msg.text().indexOf("山德") !== -1 || msg.text().indexOf("狼") !== -1) {
    await msg.say('香敷敷，软敷敷，[色]')
    return
  }

  if (msg.text().indexOf("你好骚啊") !== -1 || msg.text().indexOf("傻") !== -1) {
    await msg.say('诶不是，你怎么骂人呢！[微笑]')
    return
  }


  if (msg.text().indexOf("配件") !== -1) {
    await msg.say('著名的替身使者[悠闲]')
    return
  }

  if (msg.text().includes("涩图")) {
    // await msg.say('[旺柴]小孩子不许看');
    await msg.say(fileBox1);

    return
  }

  // if (msg.text().includes("常规图")) {
  //   let url = 'https://api.imink.jone.wang/schedules';
  //   https.get(url, res => {
  //     console.log(`状态码: ${res.statusCode}`)
  //     let data = '';
  //     res.on('data', chunk => {
  //       data += chunk;
  //     })
  //     res.on('end', () => {
  //       data = JSON.parse(data)
  //       let { regular, league, gachi } = data
  //       stageArr.push(regular[0].stage_a.image)
  //       stageArr.push(regular[0].stage_b.image)
  //       console.log()
  //       stageArr.map(item=>FileBox.fromUrl(item))
  //       for (let i = 0; i < stageArr.length; i++) {
  //         msg.say(stageArr[i]);
  //       }
  //     })
  //   }).on('error', err => {
  //     console.log(err)
  //   })
  //   return
  // }




  // if(msg.toRecalled() ){

  // }
  // https://img0.baidu.com/it/u=4062059698,1996885113&fm=26&fmt=auto&gp=0.jpg

  // 如果没人理bot超过十条信息会自动出来吃瓜
  flag++
  if (flag > 10) {
    flag = 0
    await msg.say('[吃瓜]')
  }

  canUpload = false;
}

// async function onInvitein(room,inviteeList){
//   let room = await bot.Room.find({topic: 'topic of your room'}) 
//   let nameList = inviteeList.map(c => c.name()).join(',');
//   room.say('欢迎群大佬'+nameList+'进群，快和群里的菜鸡打招呼吧~')
// }

const bot = new Wechaty({
  name: 'black-bot',
  /**
   * How to set Wechaty Puppet Provider:
   *
   *  1. Specify a `puppet` option when instantiating Wechaty. (like `{ puppet: 'wechaty-puppet-padlocal' }`, see below)
   *  1. Set the `WECHATY_PUPPET` environment variable to the puppet NPM module name. (like `wechaty-puppet-padlocal`)
   *
   * You can use the following providers:
   *  - wechaty-puppet-wechat (no token required)
   *  - wechaty-puppet-padlocal (token required)
   *  - wechaty-puppet-service (token required, see: <https://wechaty.js.org/docs/puppet-services>)
   *  - etc. see: <https://github.com/wechaty/wechaty-puppet/wiki/Directory>
   */
  // puppet: 'wechaty-puppet-wechat',
})

bot.on('scan', onScan)
bot.on('login', onLogin)
bot.on('logout', onLogout)
bot.on('message', onMessage)

bot.start()
  .then(() => log.info('StarterBot', 'Starter Bot Started.'))
  .catch(e => log.error('StarterBot', e))


import Timer from 'timer'
import { data, QUI } from './assets/resources/quithink'

class QuiThink {
  constructor (interval = 8) {
    this.interval = interval // time for one question
    this.timer = new Timer() // new a timer
    this.correct = 0
    this.incorrect = 0
    this.show = this.show.bind(this)
    this.clear = this.clear.bind(this)
    this.load = this.load.bind(this)
    this.reset = this.reset.bind(this)
    this.setQuestion = this.setQuestion.bind(this)
    this.checkAns = this.checkAns.bind(this)
    this.transition = this.transition.bind(this)
  }

  show () {
    let { height, top } = document.getElementById('quiOptions').getBoundingClientRect()
    document.getElementById('quiBarContainer').style.top = `${top}px`
    document.getElementById('quiBarContainer').style.height = `${height}px`
    document.getElementById('quickThink').style.opacity = 1
    document.getElementById('quickThink').style.zIndex = 1080
  }

  clear () {
    document.getElementById('quickThink').style.opacity = 0
    document.getElementById('quickThink').style.zIndex = 0
  }

  // 開始問答
  load () {
    if (QUI.qno === 0) {
      this.setQuestion(data[QUI.level][QUI.qno])
      QUI.qno++
    }
  }

  reset () {
    this.correct = 0
    this.incorrect = 0
    QUI.level = 0
    QUI.qno = 0
    document.getElementsByClassName('quiBar')[0].pseudoStyle('after', 'height', '0%')
    document.getElementsByClassName('quiBar')[1].pseudoStyle('after', 'height', '0%')
  }

  setQuestion (qs) {
    let { question, choices, ans } = qs

    // set question & options
    document.getElementsByClassName('quiOption')[0].style.background = 'rgb(238, 238, 238)'
    document.getElementsByClassName('quiOption')[1].style.background = 'rgb(238, 238, 238)'
    document.getElementsByClassName('quiOption')[2].style.background = 'rgb(238, 238, 238)'
    document.getElementsByClassName('quiOption')[3].style.background = 'rgb(238, 238, 238)'

    document.getElementById('quiQuestion').innerHTML = question
    choices.forEach((choice, i) => {
      let ele = document.getElementsByClassName('quiOption')[i]
      if (i === ans) {
        ele.classList.add('ans')
      }
      ele.innerHTML = choice
      ele.addEventListener('click', this.checkAns, false)
    })

    // set time
    let showTime = document.getElementById('quiTimer')
    showTime.innerHTML = this.interval

    this.timer.countdown(
      this.interval,
      () => {
        document.getElementsByClassName('quiOption')[ans].style.background = 'rgb(64,204,161)'
        window.setTimeout(this.transition, 1000)
      },
      (remain) => { showTime.innerHTML = remain }
    )
    this.show()
  }

  checkAns (e) {
    // 點選項後把interval關掉
    this.timer.timeup()

    let length = data[QUI.level].length
    // 看選對選錯給顏色
    if (e.target.classList.length === 2) {
      // Pass
      this.correct++
      e.target.style.background = 'rgb(64,204,161)'
    } else {
      // Fail
      this.incorrect++
      e.target.style.background = 'rgb(223,95,98)'
    }

    // 把ans class拿掉 不然下一題會被影響
    for (let i = 0; i < 4; i++) {
      let ele = document.getElementsByClassName('quiOption')[i]
      ele.classList.remove('ans')
    }

    // 把選項的event listener關掉
    document.getElementsByClassName('quiOption')[0].removeEventListener('click', this.checkAns)
    document.getElementsByClassName('quiOption')[1].removeEventListener('click', this.checkAns)
    document.getElementsByClassName('quiOption')[2].removeEventListener('click', this.checkAns)
    document.getElementsByClassName('quiOption')[3].removeEventListener('click', this.checkAns)
    document.getElementsByClassName('quiBar')[0].pseudoStyle('after', 'height', `${parseInt(this.correct / length * 100)}%`)
    document.getElementsByClassName('quiBar')[1].pseudoStyle('after', 'height', `${parseInt((this.incorrect / length) * 100)}%`)

    // 等待一秒進下一題
    window.setTimeout(this.transition, 1000)
  }

  transition () {
    let length = data[QUI.level].length
    if (QUI.qno < length) {
      this.setQuestion(data[QUI.level][QUI.qno])
      QUI.qno++
    } else {
      // close
      this.clear()
    }
  }
}

export default QuiThink

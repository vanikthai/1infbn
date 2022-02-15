import chatCss from "../css/c_chat.js"
class formChatR extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.online = false
  }

  static get observedAttributes () {
    return ['online']
  }

  get online () {
    return this.getAttribute('online')
  }

  set online (val) {
    return this.setAttribute('online', val)
  }

  attributeChangedCallback (prop, oldVal, newVal) {
    if (prop === 'online') {
      this.render()
    }
  }

  connectedCallback () {
    this.render()
    // const btnedit = this.shadow.getElementById('tbnedit')
    // btnedit.addEventListener('click', this.edit.bind(this))
  }
 
  render () {
      this.shadow.innerHTML = chatCss + `
      <div class="direct-chat-contacts">
      <ul class="contacts-list">
        <li>
          <!-- ///////////////////////// -->




            <!-- //////////////////////////////// -->
        </li>
        <li>
          <a href="#">
            <img class="contacts-list-img" src="https://bootdey.com/img/Content/user_1.jpg">

            <div class="contacts-list-info">
                  <span class="contacts-list-name">
                    Count Dracula
                    <small class="contacts-list-date pull-right">2/28/2015</small>
                  </span>
              <span class="contacts-list-msg">How have you been? I was...</span>
            </div>
            <!-- /.contacts-list-info -->
          </a>
        </li>
        <!-- End Contact Item -->
      </ul>
      <!-- /.contatcts-list -->
    </div>
    `
  }
}

export default function wsChat () {
  console.log('wsonline start..')
  customElements.define('ws-chatRight', formChatR)
}

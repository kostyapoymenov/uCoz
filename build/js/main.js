function acordeonSocial(){
  const form  = document.querySelector('.form-social'),
        btn   = document.querySelector('.form-more__btn');

  btn.addEventListener('click', () => {
    
    btn.classList.toggle('active');
    form.classList.toggle('form-social--active');

    if(btn.classList.contains('active')){
      btn.innerHTML= 'Скрыть'
    } else {
      btn.innerHTML= 'Другие'
    }
  });
}
acordeonSocial();

function scroll(){
  var linkNav = document.querySelectorAll('[href^="#"]'),
    V = 0;
  for (var i = 0; i < linkNav.length; i++) {
    linkNav[i].addEventListener('click', function(e) {
      e.preventDefault();
      var w = window.pageYOffset,
        hash = this.href.replace(/[^#]*(.*)/, '$1');
        t = document.querySelector(hash).getBoundingClientRect().top,
        start = null;
      requestAnimationFrame(step);
      function step(time) {
        if (start === null) start = time;
        var progress = time - start,
          r = (t < 0 ? Math.max(w - progress/V, w + t) : Math.min(w + progress/V, w + t));
        window.scrollTo(0,r);
        if (r != w + t) {
          requestAnimationFrame(step)
        } else {
          location.hash = hash
        }
      }
    }, false);
  }
}


Vue.component('todo-item', {
  template: '\
    <li class="wishlist-item">\
      {{ title }}\
      <button class="wishlist-item__btn wishlist-item__btn--red" v-on:click="$emit(\'remove\')">Удалить</button>\
    </li>\
  ',
  props: ['title']
})

new Vue({
  el: '#app',
  data: {
    newTodoText: '',
    todos: [
      {
        id: 1,
        title: 'Купить Молоко'
      },
      {
        id: 2,
        title: 'Купить яблоки'
      }
    ],
    nextTodoId: 4
  },
  methods: {
    addNewTodo: function () {
      this.todos.push({
        id: this.nextTodoId++,
        title: this.newTodoText
      })
      this.newTodoText = ''
    }
  }
})

function burger(){
  const   hamburgerBtn = document.querySelector('.hamburger'),
          hamburgerItem = document.querySelectorAll('.hamburger-menu__link'),
          hamburgerMenu = document.querySelector('.hamburger-menu');


  hamburgerBtn.addEventListener('click', function(){
      hamburgerBtn.classList.toggle('hamburger--active');
      hamburgerMenu.classList.toggle('hamburger-menu--active');
  });

  hamburgerMenu.addEventListener('click', function(event){
      var target = event.target;

      for(var i = 0; i < hamburgerItem.length; i++){
          if(target == hamburgerItem[i]){
              hamburgerBtn.classList.remove('hamburger--active');
              hamburgerMenu.classList.remove('hamburger-menu--active');
              scroll(hamburgerItem[i]);
          }
      }

  });
}
burger();


function getBodyScrollTop() {
  var bodyScrollTop = (document.body || {}).scrollTop || 0
  var documentElementScrollTop = (document.documentElement || {}).scrollTop || 0
  return Math.max(bodyScrollTop, documentElementScrollTop)
}

function CategoryPage() {
  this.categoryList = []
  this.navCategoryListEl = null

  this.init()
}
CategoryPage.prototype.init = function () {
  this.navCategoryListEl = document.querySelector('.category-list')
  this.getCategoryListAndFormat()
  this.getCategoryPosition()
  this.renderCategoryNavList()
  this.setActiveNav()
  var delay = null
  var me = this
  document.addEventListener('scroll', function () {
    clearTimeout(delay)
    delay = setTimeout(function () {
      me.setActiveNav()
    }, 30)
  })
}
CategoryPage.prototype.getCategoryListAndFormat = function () {
  var list = this.categoryList
  document.querySelectorAll('.category-card').forEach(function(node, index) {
    var titleNode = node.getElementsByClassName('category-title')[0]
    list.push({
      title: titleNode ? titleNode.innerText.trim() : '',
      id: `category-${index}`,
      mainEl: node,
      top: 0,
    })
  })
}
CategoryPage.prototype.getCategoryPosition = function () {
  this.categoryList.forEach(function(item) {
    item.top = item.mainEl.offsetTop
  })
}
CategoryPage.prototype.getCategoryById = function (id) {
  for (var i = 0; i < this.categoryList.length; i++) {
    if (this.categoryList[i].id === id) {
      return this.categoryList[i]
    }
  }
  return null
}
CategoryPage.prototype.getActiveCategory = function () {
  var bodyScrollTop = getBodyScrollTop()
  var winHeight = window.outerHeight
  for (var i = 0; i < this.categoryList.length; i++) {
    if (this.categoryList[i].top >= bodyScrollTop && this.categoryList[i].top < bodyScrollTop + winHeight) {
      return this.categoryList[i]
    }
  }
  return this.categoryList[0]
}
CategoryPage.prototype.renderCategoryNavList = function () {
  var me = this
  this.categoryList.forEach(item => {
    var element = document.createElement('div')
    element.innerText = item.title
    element.classList.add('category-item')
    this.navCategoryListEl.appendChild(element)

    var categoryItem = me.getCategoryById(item.id)
    categoryItem.navEl = element
    element.addEventListener('click', function() {
      categoryItem.mainEl.scrollIntoView({
        behavior: 'smooth',
      })
    })
  })
}
CategoryPage.prototype.setActiveNav = function () {
  var active = this.getActiveCategory()
  this.categoryList.forEach(item => {
    var useMethod = item.id === active.id ? 'add' : 'remove'
    item.navEl.classList[useMethod]('active')
  })
}

new CategoryPage()
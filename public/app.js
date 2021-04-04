function toCurrency(price) {
    return new Intl.NumberFormat('ru-RU', {
        currency: 'rub',
        style: 'currency'
    }).format(price);
}

function toDate(date) {
    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(date));
}

document.querySelectorAll('.cost').forEach(node => {
    node.textContent = toCurrency(node.textContent);
});

document.querySelectorAll('.date').forEach(node => {
    node.textContent = toDate(node.textContent);
});

const $card = document.querySelector('#card');
if($card) {
    $card.addEventListener('click', event => {
        if(event.target.classList.contains('js-remove')) {
            const id = event.target.dataset.id;
            const csurf = event.target.dataset.csurf;
            fetch('/card/remove/' + id, {
                method: 'delete',
                headers: {
                    'X-XSRF-TOKEN': csurf,
                }
            }).then(res => res.json())
              .then(card => {
                  if(card.courses.length) {
                    const html = card.courses.map(c => {
                        return `<tr>
                                    <td>${c.title}</td> 
                                    <td>${c.count}</td>
                                    <td><button class="btn btn-small js-remove" data-id="${c.id}">Удалить</button></td>
                                </tr>`;
                    }).join('');
                    $card.querySelector('tbody').innerHTML = html;
                    $card.querySelector('cost').textContent = toCurrency(card.cost);
                  }
                  else {
                      $card.innerHTML = '<p>Корзина пуста</p>'
                  }
              })
        }
    })
}

var instance = M.Tabs.init(document.querySelectorAll('.tabs'));

  // Or with jQuery

  $(document).ready(function(){
    $('.tabs').tabs();
  });
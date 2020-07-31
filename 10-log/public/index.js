import './moulds/ShopForm.js';
const { createShopFormSchema } = window.moulds;

export async function refreshShopList() {
  const res = await fetch('/api/shop');
  const { data: shopList } = await res.json();
  const htmlItems = shopList.map(
    ({ id, name }) => `
<li data-shop-id="${id}">
  <div data-type="text">${name}</div>
  <input type="text" placeholder="输入新的店铺名称" />
  <a href="#" data-type="modify">确认修改</a>
  <a href="#" data-type="remove">删除店铺</a>
  <div class="error"></div>
</li>`
  );
  document.querySelector('#root').innerHTML = `
<h1>店铺列表：</h1>
<ul class="shop-list">${htmlItems.join('')}</ul>
<h1>店铺新增：</h1>
<form method="post" action="/api/shop">
  <label>新店铺的名称：</label>
  <input type="text" name="name" />
  <button type="submit" data-type="create">确认新增</button>
  <span class="error"></span>
</form>`;
}

export async function bindShopInfoEvents() {
  document.querySelector('#root').addEventListener('click', async (e) => {
    e.preventDefault();
    switch (e.target.dataset.type) {
      case 'modify':
        await modifyShopInfo(e);
        break;
      case 'remove':
        await removeShopInfo(e);
        break;
      case 'create':
        await createShopInfo(e);
        break;
    }
  });
}

export async function modifyShopInfo(e) {
  const shopId = e.target.parentElement.dataset.shopId;
  const name = e.target.parentElement.querySelector('input').value;

  try {
    await createShopFormSchema().validate({ name });
  } catch ({ message }) {
    e.target.parentElement.querySelector('.error').innerHTML = message;
    return;
  }

  await fetch(`/api/shop/${shopId}?name=${encodeURIComponent(name)}`, {
    method: 'PUT',
    headers: {
      'Csrf-Token': __CSRF_TOKEN__,
    },
  });
  await refreshShopList();
}

export async function removeShopInfo(e) {
  const shopId = e.target.parentElement.dataset.shopId;
  const res = await fetch(`/api/shop/${shopId}`, {
    method: 'DELETE',
    headers: {
      'Csrf-Token': __CSRF_TOKEN__,
    },
  });
  await refreshShopList();
}

export async function createShopInfo(e) {
  e.preventDefault();
  const name = e.target.parentElement.querySelector('input[name=name]').value;

  try {
    await createShopFormSchema().validate({ name });
  } catch ({ message }) {
    e.target.parentElement.querySelector('.error').innerHTML = message;
    return;
  }

  await fetch('/api/shop', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Csrf-Token': __CSRF_TOKEN__,
    },
    body: `name=${encodeURIComponent(name)}`,
  });

  await refreshShopList();
}

const divMenu = document.getElementById('menu')
const btnCart = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal')
const cartItemsContainers = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
const checkoutBtn = document.getElementById('checkout-btn')
const closeModalBtn = document.getElementById('close-modal-btn')
const cartCouter = document.getElementById('cart-count')
const addressInput = document.getElementById('andress')
const warmAddress = document.getElementById('anddress-worm')


let cart = []

// Abrir o modal dp carrinho
btnCart.addEventListener('click', function () {
    updateCartModal()
    cartModal.style.display = 'flex'

})

//Fechar modal 
cartModal.addEventListener('click', function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = 'none'
    }
})

closeModalBtn.addEventListener('click', function () {
    cartModal.style.display = 'none'
})

divMenu.addEventListener('click', function (event) {
    //console.log(event.target)
    let parentButton = event.target.closest('.add-to-cart-btn')
    if (parentButton) {
        const name = parentButton.getAttribute('data-name')
        const price = parseFloat(parentButton.getAttribute('data-price'))
        addToCart(name, price) // chamada de função

    }
})

// Adicionar no carrinho
function addToCart(name, price) {
    // Se o item existe almente apenas a quantidade
    const existingItem = cart.find(item => item.name === name)
    if (existingItem) {
        existingItem.quantity += 1

    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }
    updateCartModal()
}

//Atualiza carrinho 
function updateCartModal() {
    cartItemsContainers.innerHTML = ""
    let total = 0

    cart.forEach(item => {
        const cartItemeElent = document.createElement('div')
        cartItemeElent.classList.add('flex', 'Justify-between', 'mb-4', 'flex-col')

        cartItemeElent.innerHTML = ` 
        <div class='flex items-center justify-between'>
            <div>
                <p class='font-medium'>${item.name}</p>
                <p> Qtd: ${item.quantity}</p>
                <p class='font-medium mt-2'>R$ ${item.price.toFixed(2)}</p>
            </div>

            
                <button class='remove-cart-btn', data-name='${item.name}'>
                    Remover
                </button>
            
        </div>
        
        `
        total += item.price * item.quantity
        cartItemsContainers.appendChild(cartItemeElent)
    })

    cartTotal.innerText = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })


    cartCouter.innerHTML = cart.length
}

// Função para remover itens do carrinho

cartItemsContainers.addEventListener('click', function (event) {

    if (event.target.classList.contains('remove-cart-btn')) {
        const name = event.target.getAttribute('data-name')

        removeItemCard(name)
    }


})


function removeItemCard(name) {

    const index = cart.findIndex(item => item.name === name)
    if (index !== -1) {
        const item = cart[index]

        if (item.quantity > 1) {
            item.quantity -= 1
            updateCartModal()
            return
        }

        cart.splice(item, 1)
        updateCartModal()
    }
}


addressInput.addEventListener('input', function (event) {

    let inputValue = event.target.value
    if (inputValue !== '') {
        addressInput.classList.remove('border-red-500')
        warmAddress.classList.add('hidden')
    }

})

//Finalizar pedido
checkoutBtn.addEventListener('click', function () {

    const isOpen = chekoutOpenRestaurante()
    if(!isOpen){
      Toastify({  
        text: "Ops! O Restaurnte está fechado.",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#ef4444",
        },
    }).showToast()  
      
        return
    }

    if (cart.length === 0) return
    if (addressInput.value === '') {
        warmAddress.classList.remove('hidden')
        addressInput.classList.add('border-red-500')
        return
    }

    //Enviar o pedido para Api Watsapp
     let total = 0
                
    const cartItems = cart.map((item) => {
        total += item.quantity * item.price
        let totalFormatado = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'})
        
        return (
            ` ${item.name} Quantidade: ${item.quantity} Preço: ${item.price.toFixed(2)} 
               | Total: ${totalFormatado}
            `          
            
        )   
        
    } ).join('')  

    
    
    const message = encodeURIComponent(cartItems)
    const phone = '5511984851041'
    

    window.open(`https://wa.me/${phone}?text=${message}  Enedereço: ${addressInput.value} `, '_blank')
    cart = []
    updateCartModal() // Atualizar a lista
})


function chekoutOpenRestaurante() {
    const date = new Date()
    const hors = date.getHours()
   return hors >= 8 && hors <= 22

    // true é igual restaurante aberto 
}

const dateSpan = document.getElementById('date-span')
const isOpen = chekoutOpenRestaurante()

if(isOpen) {

    dateSpan.classList.remove('bg-red-500')
    dateSpan.classList.add('bg-green-600')
} else {
    dateSpan.classList.remove('bg-green-600')
    dateSpan.classList.add('bg-red-500')
}


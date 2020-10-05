export default {
    name:    'Home',
    data() {
        return {
            message: 'Hey there, how are you?'
        }
    },
    methods: {
        helloThere() {
            const door = document.querySelector('.house_door');
            const dude = document.querySelector('.house_dude');

            door.classList.toggle("doorOpen");
            dude.classList.toggle("dudeMoves");
            const bubble = document.querySelector('.bubble');
            let message = this.message
            bubble.innerHTML = message
            setTimeout(() => {
                bubble.classList.remove("hidden");
            }, 5000)

            setTimeout(() => {
                const bubble = document.querySelector('.bubble');
                bubble.classList.add("hidden");
            }, 7000)
        }
    }
}

export default {
    name:    'Home',
    data() {
        return {
            message: ''
        }
    },
    methods: {
        helloThere() {
            const door = document.querySelector('.house_door');
            const dude = document.querySelector('.house_dude');
            door.classList.add("doorOpen");
            dude.classList.add("dudeMoves");
            const bubble = document.querySelector('.bubble');
            this.message = 'Hey there, how are you?';
            setTimeout(() => {
                bubble.classList.remove("hidden");
                setTimeout(() => {
                    bubble.classList.add("hidden");
                }, 2000)
            }, 5000)

            setTimeout(() => {
                bubble.classList.remove("hidden");
                this.message = "Come in, but don't touch my rug!"
                setTimeout(() => {
                    bubble.classList.add("hidden");
                }, 2000)
            }, 8000)

            setTimeout(() => {
                const container = document.querySelector('.outside');
                const interior = document.querySelector('.interior_current');
                container.classList.add("fadeOut");
                interior.classList.add("fadeIn");
                setTimeout(() => {
                    container.classList.add("hidden");
                    container.classList.remove("fadeOut");
                    interior.classList.remove("fadeIn");
                    door.classList.remove("doorOpen");
                    dude.classList.remove("dudeMoves");
                }, 2000)
            }, 11000)
        },
        showModal() {
            const modal = document.querySelector('.contact');
            if (modal.classList.contains('hidden')) {
                modal.classList.remove("hidden");
                modal.classList.add("openModal");
                setTimeout(() => {
                    modal.classList.remove("openModal");
                }, 1000)
            }
            else {
                modal.classList.add("closeModal");
                setTimeout(() => {
                    modal.classList.add("hidden");
                    modal.classList.remove("closeModal");
                }, 1000)
            }
        },
        closeModal() {
            const modal = document.querySelector('.contact');
            if (modal.classList.contains('hidden')) {
                return
            }
            else {
                modal.classList.add("closeModal");
                setTimeout(() => {
                    modal.classList.add("hidden");
                    modal.classList.remove("closeModal");
                }, 1000)
            }
        }
    }
}

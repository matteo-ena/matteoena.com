export default {
    name: 'Interiors',
    methods: {
        welcome() {
            const dataText = ["Hi, welcome", "I'm Matteo, web developer located in Barcelona",
                "right now I work mostly on the front end layer, so HTML, CSS, Javascript and the world of apps and tools related to them",
                "my main goal is to focus on user needs in order to find the best solution in terms of usability and web performance",
                "I also have a certification as Adobe Experience Manager Sites Business Practitioner",
                "I did this website for fun using Vue.js, a progressive javascript framework",
            "if you'd like to get in touch, just click on the mailbox in front of the house",
            "click on the door to go back outside",
            "thank you!"];

            function typeWriter(text, i, fnCallback) {
                if (i < (text.length)) {
                    const h1 = document.querySelector(".interior_presentation");
                    h1.innerHTML = text.substring(0, i + 1) + '<span aria-hidden="true"></span>';

                    setTimeout ( () => {
                        typeWriter(text, i + 1, fnCallback)
                    }, 100);
                }
                else if (typeof fnCallback == 'function') {
                    setTimeout(fnCallback, 700);
                }
            }

            function StartTextAnimation(i) {
                if (typeof dataText[i] == 'undefined') {
                    setTimeout(() => {
                        StartTextAnimation(0);
                    }, 20000);
                }
                else if (i < dataText[i].length) {
                    typeWriter(dataText[i], 0, () => {
                        StartTextAnimation(i + 1);
                    });
                }
            }

            StartTextAnimation(0);
        },
        goOutside() {
            const outside = document.querySelector('.outside');
            outside.classList.add("fadeIn");
            outside.classList.remove('hidden');
            setTimeout(() => {
                outside.classList.remove("fadeIn");
            }, 2000)
        }
    }
}

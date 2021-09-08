document.addEventListener('DOMContentLoaded', () => {
    const modalBlock = document.querySelector('#modalBlock');
    const btnOpenModal = document.querySelector('#btnOpenModal');
    const closeModal = document.querySelector('#closeModal');
    const questionTitle = document.querySelector('#question');
    const formAnswers = document.querySelector('#formAnswers');

    let answerImg;
    let answerImgDOM;
    let answerTitle;
    let answerTitleDOM;

    const playTest = () => {
        renderQuestions();
        renderAnswer();
    };

    const renderAnswer = () => {
        const answerItem = document.querySelectorAll('.answers-item');

        answerItem.forEach(elem => {
            console.log(elem);
            elem.addEventListener('click', () => {
                answerImg = elem.querySelector('.answerImg').getAttribute('src');
                answerImgDOM = document.createElement('p');
                answerImgDOM.className = 'form-answers-img-src';
                answerImgDOM.textContent = answerImg;

                answerTitle = elem.querySelector('span').textContent;
                answerTitleDOM = document.createElement('p');
                answerTitleDOM.className = 'form-answers-title';
                answerTitleDOM.textContent = answerTitle;

                let formAndswersImgSrc = document.querySelector('.form-answers-title');
                let formAndswersTitle = document.querySelector('.form-answers-img-src');
                

                if (!formAndswersImgSrc || !formAndswersTitle){
                    formAnswers.after(answerTitleDOM);
                    formAnswers.after(answerImgDOM);
                }else if(formAndswersImgSrc || formAndswersTitle){
                    formAndswersTitle.textContent = answerTitle;
                    formAndswersImgSrc.textContent = answerImg;
                }

                console.log(elem);
            });
        });
    };

    const renderQuestions = () => {
        questionTitle.textContent = 'Какого цвета бургер вы хотите?';

        formAnswers.innerHTML = `
            <div class="answers-item d-flex flex-column">
                <input type="radio" id="answerItem1" name="answer" class="d-none">
                <label for="answerItem1" class="d-flex flex-column justify-content-between">
                    <img class="answerImg" src="./image/burger.png" alt="burger">
                    <span>Стандарт</span>
                </label>
            </div>
            <div class="answers-item d-flex justify-content-center">
                <input type="radio" id="answerItem2" name="answer" class="d-none">
                <label for="answerItem2" class="d-flex flex-column justify-content-between">
                    <img class="answerImg" src="./image/burgerBlack.png" alt="burger">
                    <span>Черный</span>
                </label>
            </div>
        `;    
    };

    btnOpenModal.addEventListener('click', () => {
        modalBlock.classList.add('d-block');
        playTest();
    });

    closeModal.addEventListener('click', () => {
        modalBlock.classList.remove('d-block');
    });
});
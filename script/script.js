document.addEventListener('DOMContentLoaded', () => {
    const modalBlock = document.querySelector('#modalBlock');
    const btnOpenModal = document.querySelector('#btnOpenModal');
    const closeModal = document.querySelector('#closeModal');
    const questionTitle = document.querySelector('#question');
    const formAnswers = document.querySelector('#formAnswers');
    const nextButton = document.querySelector('#next');
    const prevButton = document.querySelector('#prev');

    let answerImg;
    let answerImgDOM;
    let answerTitle;
    let answerTitleDOM;
    let answerType;
    let formAndswersImgSrc;
    let formAndswersTitle;
    
    let answerCount = 0;
    let cartCount = 0;

    const getData = async () => {
        const data = await fetch('questions.json');
        if (data.ok) {
            return data.json();
        } else {
            throw new Error(`Дані не були отримані, помилка ${data.status} ${data.statusText}`)
        }
    };

    const getGoods = (callback) => {
        getData()
            .then(data => {
                callback(data);
            })
            .catch(err => {
                console.error(err);
            });
    };

    const renderAnswer = () => {
        const answerItem = document.querySelectorAll('.answers-item');
        

        answerItem.forEach(elem => {
            elem.addEventListener('click', () => {
                answerType = elem.querySelector('input').getAttribute('type');

                answerImg = elem.querySelector('.answerImg').getAttribute('src');
                answerImgDOM = document.createElement('p');
                answerImgDOM.className = 'form-answers-img-src';
                answerImgDOM.textContent = answerImg;

                answerTitle = elem.querySelector('span').textContent;
                answerTitleDOM = document.createElement('p');
                answerTitleDOM.className = 'form-answers-title';
                answerTitleDOM.textContent = answerTitle;

                formAndswersImgSrc = document.querySelector('.form-answers-title');
                formAndswersTitle = document.querySelector('.form-answers-img-src');
                

                if (!formAndswersImgSrc || !formAndswersTitle){
                    // formAnswers.after(answerTitleDOM);
                    // formAnswers.after(answerImgDOM);
                }else if(formAndswersImgSrc || formAndswersTitle){
                    // formAndswersTitle.textContent = answerTitle;
                    // formAndswersImgSrc.textContent = answerImg;
                }                
            });
        });
    };

    const renderQuestions = (imgUrl, title, type) => {
        formAnswers.innerHTML += `
            <div class="answers-item d-flex flex-column">
                <input type="${type}" id="answerItem${cartCount}" name="answer" class="d-none">
                <label for="answerItem${cartCount}" class="d-flex flex-column justify-content-between">
                    <img class="answerImg" src="${imgUrl}" alt="burger">
                    <span>${title}</span>
                </label>
            </div>
        `;
        cartCount += 1;
    };


    getGoods((data) => {
        const questions = data.questions;

        const playTest = (index) => {
            questionTitle.textContent = questions[index].question;
            questions[index].answers.forEach(element => {
                renderQuestions(element.url, element.title, questions[index].type);
            });
      
            renderAnswer();
        };


        btnOpenModal.addEventListener('click', () => {
            modalBlock.classList.add('d-block');
            playTest(answerCount);
        });
    
        closeModal.addEventListener('click', () => {
            modalBlock.classList.remove('d-block');
        });
    
        nextButton.addEventListener('click', () => {
            formAnswers.innerHTML = '';
            answerCount++;
            playTest(answerCount);
            answerCount >= 0 ? prevButton.classList.remove('hide') : null;
            answerCount >= (questions.length-1) ? nextButton.classList.add('hide') : null;
        })
        prevButton.addEventListener('click', () => {
            formAnswers.innerHTML = '';
            answerCount--;
            playTest(answerCount);
            answerCount <= 0 ? prevButton.classList.add('hide') : null;
            answerCount <= (questions.length-1) ? nextButton.classList.remove('hide') : null;
        })
    });
 
});
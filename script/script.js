document.addEventListener('DOMContentLoaded', () => {
    const modalBlock = document.querySelector('#modalBlock');
    const btnOpenModal = document.querySelector('#btnOpenModal');
    const closeModal = document.querySelector('#closeModal');
    const questionTitle = document.querySelector('#question');
    const formAnswers = document.querySelector('#formAnswers');
    const nextButton = document.querySelector('#next');
    const prevButton = document.querySelector('#prev');
    const sendBtn = document.querySelector('#send');

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


                if (!formAndswersImgSrc || !formAndswersTitle) {
                    // formAnswers.after(answerTitleDOM);
                    // formAnswers.after(answerImgDOM);
                } else if (formAndswersImgSrc || formAndswersTitle) {
                    // formAndswersTitle.textContent = answerTitle;
                    // formAndswersImgSrc.textContent = answerImg;
                }
            });
        });
    };


    const isNumericInput = (event) => {
        const key = event.keyCode;
        return ((key >= 48 && key <= 57) || // Allow number line
            (key >= 96 && key <= 105) // Allow number pad
        );
    };

    const isModifierKey = (event) => {
        const key = event.keyCode;
        return (event.shiftKey === true || key === 35 || key === 36) || // Allow Shift, Home, End
            (key === 8 || key === 9 || key === 13 || key === 46) || // Allow Backspace, Tab, Enter, Delete
            (key > 36 && key < 41) || // Allow left, up, right, down
            (
                // Allow Ctrl/Command + A,C,V,X,Z
                (event.ctrlKey === true || event.metaKey === true) &&
                (key === 65 || key === 67 || key === 86 || key === 88 || key === 90)
            )
    };

    const enforceFormat = (event) => {
        // Input must be of a valid number format or a modifier key, and not longer than ten digits
        if (!isNumericInput(event) && !isModifierKey(event)) {
            event.preventDefault();
        }
    };

    const formatToPhone = (event) => {
        if (isModifierKey(event)) { return; }

        const input = event.target.value.replace(/\D/g, '').substring(0, 10); // First ten digits of input only
        const areaCode = input.substring(0, 3);
        const middle = input.substring(3, 6);
        const last = input.substring(6, 10);

        if (input.length > 6) { event.target.value = `(${areaCode}) ${middle} - ${last}`; }
        else if (input.length > 3) { event.target.value = `(${areaCode}) ${middle}`; }
        else if (input.length > 0) { event.target.value = `(${areaCode}`; }
    };

    getGoods((data) => {
        const questions = data.questions;
        let obj = {};

        const renderQuestions = (imgUrl, title, type) => {
            formAnswers.innerHTML += `
                <div class="answers-item d-flex flex-column">
                    <input type="${type}" id="answerItem${cartCount}" name="answer" class="d-none" value='${title}' ${checkedQuestion(title)}>
                    <label for="answerItem${cartCount}" class="d-flex flex-column justify-content-between">
                        <img class="answerImg" src="${imgUrl}" alt="burger">
                        <span>${title}</span>
                    </label>
                </div>
            `;
            cartCount += 1;
        };

        const checkedQuestion = (title) => {
            for (const [key, value] of Object.entries(obj)) {
                if (title == value) { return 'checked' }
            }
        };

        const chechAnswer = () => {
            const inputs = [...formAnswers.elements].filter((input) => input.checked);

            inputs.forEach((input, index) => {
                obj[`${index}_${questions[answerCount].question}`] = input.value;
                console.log(obj)
            })
        };

        const playTest = (index) => {
            questionTitle.textContent = questions[index].question;
            formAnswers.innerHTML = '';

            questions[index].answers.forEach(element => {
                renderQuestions(element.url, element.title, questions[index].type, index);
            });

            renderAnswer();
        };

        const checkIsLast = () => {
            if (answerCount == questions.length) {
                formAnswers.innerHTML = `
                <label for="phone">Enter your phone number:</label>

                <input id="phoneNumber" placeholder="Phone Number" maxlength="16" />
                `;
            }
            const inputElement = document.getElementById('phoneNumber');
            inputElement.addEventListener('keydown', enforceFormat);
            inputElement.addEventListener('keyup', formatToPhone);
        }


        btnOpenModal.addEventListener('click', () => {
            modalBlock.classList.add('d-block');
            playTest(answerCount);
        });

        closeModal.addEventListener('click', () => {
            modalBlock.classList.remove('d-block');
        });

        nextButton.addEventListener('click', () => {
            chechAnswer();
            formAnswers.innerHTML = '';
            answerCount++;
            answerCount >= 0 ? prevButton.classList.remove('hide') : null;
            if (answerCount >= questions.length) {
                checkIsLast();
                nextButton.classList.add('hide');
                sendBtn.classList.remove('d-none');
            }
            playTest(answerCount);
        });
        prevButton.addEventListener('click', () => {
            chechAnswer();
            formAnswers.innerHTML = '';
            answerCount--;
            
            answerCount <= 0 ? prevButton.classList.add('hide') : null;
            if (answerCount <= questions.length) {
                nextButton.classList.remove('hide');
                sendBtn.classList.add('d-none');
            }
            playTest(answerCount);
        });
        sendBtn.addEventListener('click', () => {
            obj[`phone number`] = phoneNumber.value;
            chechAnswer();
            modalBlock.classList.remove('d-block');
            console.log(obj)
        });
    });

});
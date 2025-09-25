
        const questions = [
            {
                question: "What is JavaScript?",
                options: [
                    "A programming language",
                    "A markup language",
                    "A styling language",
                    "A database"
                ],
                correct: 0
            },
            {
                question: "Which keyword is used to declare variables in JavaScript?",
                options: [
                    "var",
                    "let",
                    "const",
                    "All of the above"
                ],
                correct: 3
            },
            {
                question: "What is the correct way to write a JavaScript array?",
                options: [
                    "(1,2,3)",
                    "{1,2,3}",
                    "[1,2,3]",
                    "<1,2,3>"
                ],
                correct: 2
            },
            {
                question: "Which operator is used for equality comparison?",
                options: [
                    "=",
                    "==",
                    "===",
                    "Both == and ==="
                ],
                correct: 3
            },
            {
                question: "What will console.log(typeof([])) display?",
                options: [
                    "array",
                    "object",
                    "undefined",
                    "null"
                ],
                correct: 1
            }
        ];

        let currentQuestion = 0;
        let score = 0;
        let userName = "";
        let userAnswers = new Array(questions.length).fill(null);

        function startQuiz() {
            userName = document.getElementById("userName").value;
            if (!userName) {
                alert("Please enter your name");
                return;
            }
            document.querySelector(".welcome-screen").style.display = "none";
            document.querySelector(".quiz-container").style.display = "block";
            currentQuestion = 0;
            userAnswers = new Array(questions.length).fill(null);
            score = 0;
            showQuestion();
        }

        function showQuestion() {
            if (currentQuestion >= questions.length) {
                showResult();
                return;
            }

            const questionData = questions[currentQuestion];
            document.getElementById("question").innerHTML = `
                <h2>Question ${currentQuestion + 1}/5</h2>
                <p class="question">${questionData.question}</p>
            `;

            const optionsHtml = questionData.options.map((option, index) => `
                <div class="option ${userAnswers[currentQuestion] === index ? 'selected' : ''}" 
                    onclick="selectOption(this, ${index})">${option}</div>
            `).join("");

            document.getElementById("options").innerHTML = optionsHtml;

            document.getElementById("prevBtn").style.display = currentQuestion > 0 ? "block" : "none";
            
            document.getElementById("nextBtn").textContent = 
                currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next";
        }

        function selectOption(element, index) {
            document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
            element.classList.add('selected');
            element.dataset.selected = index;
            userAnswers[currentQuestion] = index;
        }

        function previousQuestion() {
            if (currentQuestion > 0) {
                currentQuestion--;
                showQuestion();
            }
        }

        function submitAnswer() {
            const selected = document.querySelector('.option.selected');
            if (!selected) {
                alert("Please select an answer");
                return;
            }

            if (currentQuestion === questions.length - 1) {
                score = userAnswers.reduce((total, answer, index) => 
                    total + (answer === questions[index].correct ? 1 : 0), 0);
                showResult();
            } else {
                currentQuestion++;
                showQuestion();
            }
        }

        function showResult() {
            document.querySelector(".quiz-container").style.display = "none";
            if (score >= 3) {
                showCertificate();
            } else {
                alert(`Sorry ${userName}, you scored ${score}/5. You need at least 3 correct answers to get the certificate.`);
                location.reload();
            }
        }

        function showCertificate() {
            document.getElementById("certificate").style.display = "block";
            document.getElementById("certificateName").textContent = userName;
            document.getElementById("score").textContent = score;
            document.getElementById("date").textContent = new Date().toLocaleDateString();
        }

        function downloadCertificate() {
            const element = document.getElementById('certificate');
            const opt = {
                margin: 0,
                filename: `anubhav-course-${userName.toLowerCase().replace(/\s+/g, '-')}.pdf`,
                image: { type: 'jpeg', quality: 1 },
                html2canvas: { 
                    scale: 2,
                    useCORS: true,
                    letterRendering: true,
                    width: 1000,
                    height: 700,
                    windowWidth: 1000,
                    windowHeight: 700,
                    x: 0,
                    y: 0,
                    scrollX: 0,
                    scrollY: 0,
                    logging: false,
                    onclone: function(clonedDoc) {
                        const cert = clonedDoc.querySelector('.certificate');
                        cert.style.transform = 'none';
                        cert.style.margin = '0';
                        cert.style.width = '1000px';
                        cert.style.height = '700px';
                        cert.style.position = 'relative';
                        cert.style.left = '0';
                        cert.style.top = '0';
                    }
                },
                jsPDF: { 
                    unit: 'px', 
                    format: [1000, 700], 
                    orientation: 'landscape',
                    compress: true,
                    precision: 32,
                    hotfixes: ['px_scaling']
                }
            };

            // Hide download button
            const downloadBtn = document.querySelector('.download-btn');
            downloadBtn.style.display = 'none';

            // Generate PDF with centering fix
            html2pdf()
                .set(opt)
                .from(element)
                .save()
                .then(() => {
                    downloadBtn.style.display = 'block';
                })
                .catch(err => {
                    console.error('PDF generation error:', err);
                    downloadBtn.style.display = 'block';
                });
        }

        // Ensure fonts and resources are loaded
        document.fonts.ready.then(function () {
            console.log('Fonts loaded and ready');
        });

class FeedbackData {
    constructor(name, email, team, agree) {
        this.name = name;
        this.email = email;
        this.team = team;
        this.agree = agree;
    }

    printToConsole() {
        console.log("=== Новый отклик от пользователя ===");
        console.log(`Имя: ${this.name}`);
        console.log(`Email: ${this.email}`);
        console.log(`Любимая команда: ${this.team}`);
        console.log(`Согласие: ${this.agree ? "Да" : "Нет"}`);
        console.log("====================================");
    }
}

document.getElementById("feedbackForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const data = new FeedbackData(
        document.getElementById("name").value,
        document.getElementById("email").value,
        document.getElementById("team").value,
        document.getElementById("agree").checked
    );

    data.printToConsole(); 
});

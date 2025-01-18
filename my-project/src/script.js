console.log("Strona została załadowana!");
let i = 0
//All html elements that have the "clickable" class
//we need this to assing event listeners 
const clickableElements = document.getElementsByClassName("clickable")
for (let clickableElement of clickableElements) {
    clickableElement.addEventListener("click", () => {
        i = i + 1
        if (i < 10) {
            clickableElement.classList.toggle("green")
        }
        else if (i < 20) {
            clickableElement.classList.remove("green")
            clickableElement.classList.toggle("orange")
        }

        else if (i < 30) {
            clickableElement.classList.remove("orange")
            clickableElement.classList.toggle("red")
        } else i = 0

    })
}
let liczba = 1
let napis = "0"
let suma = napis + liczba
console.log(suma)
console.log(Number(napis) + liczba)

const obiekt = {
    pole: "wartość"

}
console.log(obiekt)

const person = {
    name: "Jerzy",
    surname: "Zambrzycki",
    age: 29,
    married: true,
    add: (a, b) => a + b,
    isOld: () => {
        // if (this.age > 30) 
        //     return true
        // if (this.age <= 30)
        //     return false
        return this.age > 30

    }


}
console.log(person)
const personalDataElement = document.getElementById("personalData")
personalDataElement.innerHTML = `
    <p> Name: ${person.name} </p>
    <p> Surname:${person.surname} </p>
    <p> Age: ${person.age} </p>
    <p> Married: ${person.married} </p>
    <p> Result of add: ${person.add(12, 13)} </p>
    <p> Is old?: ${person.isOld() ? "yes" : "no"} </p>
`
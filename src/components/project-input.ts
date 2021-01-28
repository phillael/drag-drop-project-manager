import { Component } from "./base-Component";
import * as Validation from "../utils/validation";
import { autobind } from "../decorators/autobind";
import { projectState } from "../state/project-state";

// ProjectInput Class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");
    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.configure();
  }

  configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  renderContent() {}

  titleErr = document.getElementById("title-validation");
  descriptionErr = document.getElementById("description-validation");
  numberErr = document.getElementById("number-validation");

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValidatable: Validation.Validatable = {
      value: enteredTitle,
      required: true,
      minLength: 2,
    };
    const descriptionValidatable: Validation.Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };
    const peopleValidatable: Validation.Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 100,
    };

    if (!Validation.validate(titleValidatable)) {
      this.titleErr!.innerHTML = "Title must be at least 2 characters";
      return;
    }
    if (!Validation.validate(descriptionValidatable)) {
      this.descriptionErr!.innerHTML =
        "Description must be at least 5 characters";
      return;
    }
    if (!Validation.validate(peopleValidatable)) {
      this.numberErr!.innerHTML = "Must be a number between 1 and 100";
      return;
    } else {
      this.titleErr ? (this.titleErr.innerHTML = "") : null;
      this.descriptionErr ? (this.descriptionErr.innerHTML = "") : null;
      this.numberErr ? (this.numberErr.innerHTML = "") : null;
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    console.log(this.titleInputElement.value);
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      projectState.addProject(title, description, people);
      this.clearInputs();
    }
  }
}

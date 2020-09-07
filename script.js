import faker from 'faker';

const tbody = document.querySelector('tbody');

let persons = Array.from({ length: 10 }, () => {
	return {
		id: faker.random.uuid(),
		lastName: faker.name.lastName(),
		firstName: faker.name.firstName(),
		jobTitle: faker.name.jobTitle(),
		jobArea: faker.name.jobArea(),
		phone: faker.phone.phoneNumber(),
		picture: faker.image.avatar(100, 100),
	};
});

const displayList = data => {
	tbody.innerHTML = data
		.map(
			(person, index) => `
    <tr data-id="${person.id}" value= "${person.id}" class="${index % 2 ? 'even' : ''}">
        <td><img src="${person.picture}" alt="${person.firstName + ' ' + person.lastName}"/></td>
        <td>${person.lastName}</td>
        <td>${person.firstName}</td>
        <td>${person.jobTitle}</td>
        <td>${person.jobArea}</td>
        <td>${person.phone}</td>
        <td>
            <button class="edit" value="${person.id}">
                <svg viewBox="0 0 20 20" fill="currentColor" class="pencil w-6 h-6"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>
            </button>
            <button class="delete" value="${person.id}">
                <svg viewBox="0 0 20 20" fill="currentColor" class="trash w-6 h-6"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
            </button>
            </td>
    </tr>
`
		)
		.join('');
};

//delete function
async function destroyForm(form) {
	form.remove();
	form = null;
}

const editPartner = (e) => {
	// code edit function here
	//
	const editBtn = e.target.closest('.edit');
	if (editBtn) {
		const searchId = e.target.closest('tr')
		const btn = searchId.querySelector('.edit');
		const id = btn.value;
		editPartnerPopup(id);
	}
};

const editPartnerPopup = (id) => {
	// Find the person by id
	const editPerson = persons.find(person => person.id === id);

	// Wrap with promise
	return new Promise(async function (resolve) {
		const form = document.createElement("form");
		form.classList.add('form');
		form.insertAdjacentHTML('afterbegin', `
		<p>Edit your partner</p>
		<fieldset>
			<label for="lastname">Last name</label>
			<input type="text" name="lastname" id="lastname" value="${editPerson.lastName}">
		</fieldset>
		<fieldset>
			<label for="firstname">First name</label>
			<input type="text" name="firstname" id="firstname" value="${editPerson.firstName}">
		</fieldset>
		<fieldset>
			<label for="jobTitle">Job title</label>
			<input type="text" name="jobTitle" id="jobTitle" value="${editPerson.jobTitle}">
		</fieldset>
		<fieldset>
			<label for="jobArea">Job area</label>
			<input type="text" name="jobArea" id="jobArea" value="${editPerson.jobArea}">
		</fieldset>
		<fieldset>
			<label for="phone">Phone number</label>
			<input type="text" name="phone" id="phone" value="${editPerson.phone}">
		</fieldset>
		<div class="form_buttons">
			<button type="submit" class="submit">Save</button>
			<button type="button" class="cancel">Cancel</button>
		</div>	
		`);
		document.body.appendChild(form);
		form.classList.add('open');

		form.addEventListener("submit", e => {
			e.preventDefault();
			editPerson.lastName = form.lastname.value;
			editPerson.firstName = form.firstname.value;
			editPerson.jobTitle = form.jobTitle.value;
			editPerson.jobArea = form.jobArea.value;
			editPerson.phone = form.phone.value;

			console.log(displayList(persons));

			// Destroy the form
			destroyForm(form);
		}, { once: true });

		// Cancel button
		window.addEventListener('click', (e) => {
			const cancelBtn = e.target.closest('.cancel');
			if (cancelBtn) {
				destroyForm(form);
			}
		})
		
		document.body.appendChild(form);
		form.classList.add("open");
	})
};

const deletePartner = (e) => {
	// code delete function gere
	return new Promise(function (resolve) {
		//find which button gets clicked if it matches the delete buttons
		const buttonDelete = e.target.closest(".delete");
		//if the delete buttons get clicked : do smt
		if (buttonDelete) {
			const tr = buttonDelete.parentElement;
			const button = tr.querySelector(".delete");
			const id = button.value;
			deletePopup(id);
		}
	})
};

const deletePopup = async (id) => {
	// Finding the person by id
	const findPerson = persons.find(person => person.id === id);

	// confirmation delete
	return new Promise(async function (resolve) {
		const deletedPartner = document.createElement("form");
		deletedPartner.classList.add('form')
		deletedPartner.classList.add("deletePopup");
		
		deletedPartner.insertAdjacentHTML("afterbegin", `
		<div>Are you sure you want to delete ${findPerson.lastName}</div>
		<fieldset>
			<button type="submit" class="confirm">Confirm</button>
			<button type="button" class="cancel">Cancel</button>
		</fieldset>
    	`)
		
		document.body.appendChild(deletedPartner);
		deletedPartner.classList.add("open");

		// Confirm delete
		deletedPartner.addEventListener("submit", (e) => {
			const tr = e.target.closest('tr');
			console.log(tr);
			tr.remove();
			destroyForm(deletedPartner);
		});

		// Event listner for the cancel button
		window.addEventListener("click", e => {
			const cancelBtn = e.target.closest('.cancel');
			if (cancelBtn) {
				destroyForm(deletedPartner);
			}
		});
	})
};


//event listeners
window.addEventListener("click", editPartner);
window.addEventListener("click", deletePartner);
displayList(persons);

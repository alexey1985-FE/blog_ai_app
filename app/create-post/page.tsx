"use client";

import { useState } from "react";

export default function CreatePost() {
	const initialState = {
		title: "",
		category: "",
		content: "",
	};

	const categoryOption = [
		"Fashion",
		"Tech",
		"Food",
		"Politics",
		"Sports",
		"Travel",
		"Business",
	];

	const [form, setForm] = useState(initialState);
	const [file, setFile] = useState(null);
	const [imageURL, setImageURL] = useState("");

	const { title, category, content } = form;

	const onCategoryChange = e => {
		setForm({ ...form, category: e.target.value });
	};

	const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

		const imageUrl = URL.createObjectURL(selectedFile);
    setImageURL(imageUrl);
  };

	console.log(file)

	return (
		<div className="flex justify-center mt-2 mb-10 min-w-1000">
			<form className="max-w-screen-xl">
				<div className="space-y-12">
					<div className=" border-gray-900/10">
						<div className="min-w-[50rem] mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
							<div className="col-span-full">
								<label
									htmlFor="title"
									className="block text-sm font-medium leading-6 text-gray-900"
								>
									Title
								</label>
								<div className="mt-2">
									<input
										type="text"
										name="title"
										id="title"
										className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									/>
								</div>
							</div>

							<div className="col-span-full">
								<label
									htmlFor="about"
									className="block text-sm font-medium leading-6 text-gray-900"
								>
									Description
								</label>
								<div className="mt-2">
									<textarea
										id="about"
										name="about"
										rows={5}
										className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
										defaultValue={""}
									/>
								</div>
							</div>

							<div className="col-span-full">
								<select
									value={category}
									onChange={onCategoryChange}
									className="rounded-md border-0 shadow-sm ring-1 ring-inset ring-gray-300 py-1.5 px-1 w-full"
								>
									<option>Category</option>
									{categoryOption.map((option, index) => (
										<option value={option || ""} key={index}>
											{option}
										</option>
									))}
								</select>
							</div>

							<div className="col-span-full">
								<label
									htmlFor="image"
									className="block text-sm font-medium leading-6 text-gray-900"
								>
									Image
								</label>
								<div className="mt-2">
									<input
										type="file"
										name="image"
										id="image"
										onChange={handleFileChange}
										className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									/>
								</div>
								{imageURL && (
            <img
              src={imageURL}
              alt="Preview"
              className="mt-2 w-20 h-auto"
            />
          )}
							</div>
						</div>
					</div>
				</div>

				<div className="mt-6 flex items-center justify-end gap-x-6">
					<button
						type="submit"
						className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>
						Create
					</button>
				</div>
			</form>
		</div>
	);
}

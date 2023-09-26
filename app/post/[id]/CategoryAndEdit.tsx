import { EditorProps } from "@/types";
import React, { useState, useEffect } from "react";
import { XMarkIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";

const CategoryAndEdit = ({
	isEditable,
	handleIsEditable,
	title,
	setTitle,
	tempTitle,
	setTempTitle,
	tempContent,
	setTempContent,
	editor,
	post,
}: EditorProps) => {
	const [userUid, setUserUid] = useState<string | null>(null);
	const [userGoogleUid, setUserGoogleUid] = useState<string | null>(null);

	const { data } = useSession();
	const userLogedInId = data?.user?.uid;

	const handleEnableEdit = () => {
		handleIsEditable(!isEditable);
		setTempTitle(title);
		setTempContent(editor?.getHTML() || "");
	};

	const handleCancelEdit = () => {
		handleIsEditable(!isEditable);
		setTitle(tempTitle);
		editor?.commands.setContent(tempContent);
	};

	useEffect(() => {
		setUserUid(userLogedInId as string);
		setUserGoogleUid(data?.user?.uid as string)
	}, [data]);

	return (
		<div className="flex justify-between items-center">
			<h4 className="bg-accent-orange py-2 px-5 text-wh-900 text-sm font-bold">
				{post.category}
			</h4>
			{((userUid && userUid === post.uid) || (userGoogleUid && userGoogleUid === post.googleUid)) && (
				<div className="mt-4">
					{isEditable ? (
						<div className="flex justify-between gap-3">
							<button onClick={handleCancelEdit}>
								<XMarkIcon className="h-6 w-6 text-accent-red" />
							</button>
						</div>
					) : (
						<button onClick={handleEnableEdit}>
							<PencilSquareIcon className="h-6 w-6 text-accent-red" />
						</button>
					)}
				</div>
			)}
		</div>
	);
};

export default CategoryAndEdit;

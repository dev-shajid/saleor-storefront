import Image from "next/image";
import { type UserDetailsFragment } from "@/gql/graphql";

type Props = {
	user: UserDetailsFragment;
	style?: React.CSSProperties;
};

export const UserAvatar = ({ user, style }: Props) => {
	const label =
		user.firstName && user.lastName
			? `${user.firstName.slice(0, 1)}${user.lastName.slice(0, 1)}`
			: user.email.slice(0, 2);

	if (user?.avatar) {
		return (
			<Image
				className={`aspect-square h-8 w-8 rounded-full border`}
				aria-hidden="true"
				src={user.avatar.url}
				width={24}
				height={24}
				alt=""
			/>
		);
	}

	return (
		<span
			className={`flex !aspect-square h-8 w-8 items-center justify-center rounded-full border bg-white text-center text-xs font-bold uppercase`}
			style={style}
			aria-hidden="true"
		>
			{label}
		</span>
	);
};

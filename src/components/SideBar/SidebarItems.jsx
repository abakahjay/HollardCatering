/* eslint-disable react/prop-types */
import CreatePost from "./CreatePost";
import Home from "./Home";
import Notifications from "./Notifications";
import ProfileLink from "./ProfileLink";
import Search from "./Search";
import Messages from './MessagesLink'
import { ChatGptLogo ,UpgradeLogo, MoreLogo,NewChatLogo,SearchLogos,HideSideBarLogo,MicLogo,ArrowDropLogo,HistoryLogo} from "../../assets/constants";
import NewChat from "./NewChat";
import SearchChats from "./SearchChats";
import HistoryLink from "./HistoryLink"
import DataPageLink from "./DataPageLink"

const SidebarItems = ({authUser,onLogout}) => {
	const user=authUser.user?authUser.user:authUser
	const isCaterer = user.role === "caterer";
	const isAdmin = user.role === "admin";
	return (
		<>
			{/* <ChatGptLogo/>
			<UpgradeLogo/>
			<MoreLogo/>
			<NewChatLogo/>
			<SearchLogos/>
			<HideSideBarLogo/>
			<MicLogo/>
			<ArrowDropLogo/> */}
			{/* Hide these two if user is Caterer */}
			{!isCaterer && <NewChat />}         {/* Start Order */}
			{!isCaterer && <SearchChats authUser={authUser} />} {/* Find Meal */}

			<HistoryLink authUser={authUser} />
			{/* <Home authUser={authUser} onLogout={onLogout} />
			<Notifications authUser={authUser} onLogout={onLogout}/>
			<Search authUser={authUser} onLogout={onLogout}/>
			<CreatePost authUser={authUser} onLogout={onLogout}/>
			<Messages authUser={authUser} onLogouot={onLogout}/> */}
			<Messages authUser={authUser} onLogouot={onLogout}/>
			{(isAdmin || isCaterer) &&<DataPageLink authUser={authUser} onLogouot={onLogout}/>}
			<ProfileLink authUser={authUser} onLogout={onLogout} />
		</>
	);
};

export default SidebarItems;

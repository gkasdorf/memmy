import React, {useEffect} from "react";
import FeedView from "../../ui/Feed/FeedView";
import FeedHeaderDropdown from "../../ui/Feed/FeedHeaderDropdown";
import {useFeed} from "../../hooks/feeds/feedsHooks";
import {initialize, lemmyInstance} from "../../../lemmy/LemmyInstance";
import {useAppDispatch, useAppSelector} from "../../../store";
import {getAllCommunities, getSubscribedCommunities} from "../../../slices/communities/communitiesActions";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {loadSettings} from "../../../slices/settings/settingsActions";
import CIconButton from "../../ui/CIconButton";
import {selectSettings} from "../../../slices/settings/settingsSlice";
import {Text} from "native-base";

const FeedsIndexScreen = ({navigation}: {navigation: NativeStackNavigationProp<any>}) => {
    navigation.setOptions({
        headerTitle: () => <FeedHeaderDropdown title={sortFix()} enabled={true} />,
        headerLeft: () => <CIconButton name={"star-outline"} onPress={() => navigation.push("Subscriptions")} />
    });

    const feed = useFeed();

    const settings = useAppSelector(selectSettings);

    const dispatch = useAppDispatch();

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        if(!lemmyInstance) {
            try {
                await initialize({
                    server: settings.accounts[0].instance,
                    username: settings.accounts[0].username,
                    password: settings.accounts[0].password,
                    auth: settings.accounts[0].token
                });

                feed.load(false);
                dispatch(getSubscribedCommunities());
                dispatch(getAllCommunities());
                dispatch(loadSettings());
            } catch (e) {
                console.log("Error", e);
            }
        }
    };

    const sortFix = () => {
        if(feed.sort === "MostComments") return "Most Comments";
        else if(feed.sort === "TopDay") return "Top Day";
        else if(feed.sort === "TopWeek") return "Top Week";

        return feed.sort;
    };

    return <FeedView posts={feed.posts} loading={feed.loading} load={feed.load} setSort={feed.setSort} titleDropsdown={true} setListingType={feed.setListingType} />;

    return <Text> Hello</Text>;
};

export default FeedsIndexScreen;
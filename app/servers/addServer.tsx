import React, {useEffect, useState} from "react";
import {Alert, Button, Settings, StyleSheet, TextInput} from "react-native";
import {ScrollView, useToast} from "native-base";
import {Cell, Section, TableView} from "react-native-tableview-simple";
import ILemmyServer from "../../lemmy/types/ILemmyServer";
import {Stack, useRouter, useSearchParams} from "expo-router";
import {initialize, lemmyAuthToken, lemmyInstance} from "../../lemmy/LemmyInstance";
import servers from "./index";

const AddServerScreen = () => {
    const [form, setForm] = useState<ILemmyServer>({
        server: "",
        username: "",
        password: "",
        auth: ""
    });
    const [loading, setLoading] = useState(false);

    const {serverIndex} = useSearchParams();

    const router = useRouter();
    const toast = useToast();

    useEffect(() => {
        if(serverIndex) {
            const servers = Settings.get("servers");
            setForm(servers[Number(serverIndex)] as ILemmyServer);
        }
    }, []);

    const onFormChange = (name: string, value: string) => {
        setForm({
            ...form,
            [name]: value
        });
    };

    const onSavePress = async () => {
        if(!form.server || !form.username || !form.password) {
            toast.show({
                description: "All fields are required.",
                duration: 3000
            });
            return;
        }

        try {
            setLoading(true);

            await initialize(form);
        } catch {
            Alert.alert("Error authenticating with server.");
            setLoading(false);
            return;
        }

        const servers = Settings.get("servers") as ILemmyServer[] ?? [];
        const serverIndex = servers.findIndex((x) => (x.server.toLowerCase() === form.server.toLowerCase() && x.username.toLowerCase() === form.username.toLowerCase()))

        if(serverIndex > -1) {
            servers[serverIndex] = {
                ...form,
                auth: lemmyAuthToken
            };
        } else {
            servers.push({
                ...form,
                auth: lemmyAuthToken
            });
        }

        Settings.set({
            servers
        });

        router.back();
    };

    const onDeletePress = () => {
        const servers = Settings.get("servers") as ILemmyServer[];
        const serverIndex = servers.findIndex((x) => (x.server.toLowerCase() === form.server.toLowerCase() && x.username.toLowerCase() === form.username.toLowerCase()))

        delete servers[serverIndex];

        Settings.set({
            servers
        });

        router.back();
    };

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen
                options={{
                    headerRight: () => {
                        return(
                            <Button title={"Save"} onPress={onSavePress} disabled={loading} />
                        );
                    }
                }}
            />

            <TableView style={styles.table}>
                <Section
                    header={"SERVER ADDRESS"}
                    roundedCorners={true}
                    hideSurroundingSeparators={true}
                    footer={"URL for the server you wish to connect"}
                >
                    <Cell cellContentView={
                        <TextInput
                            style={{fontSize: 16, flex: 1}}
                            placeholder="Server Address"
                            value={form.server}
                            onChangeText={(text) => onFormChange("server", text)}
                            autoCapitalize={"none"}
                            autoCorrect={false}
                        />
                    } />
                </Section>

                <Section
                    header={"SERVER CREDENTIALS"}
                    roundedCorners={true}
                    hideSurroundingSeparators={true}
                    footer={"Credentials for the server you are connecting."}
                >
                    <Cell cellContentView={
                        <TextInput
                            style={{fontSize: 16, flex: 1}}
                            placeholder={"Username"}
                            value={form.username}
                            onChangeText={(text) => onFormChange("username", text)}
                            autoCapitalize={"none"}
                            autoCorrect={false}
                        />
                    } />
                    <Cell cellContentView={
                        <TextInput
                            style={{fontSize: 16, flex: 1}}
                            placeholder={"Password"}
                            value={form.password}
                            onChangeText={(text) => onFormChange("password", text)}
                            autoCorrect={false}
                            autoCapitalize={"none"}
                            secureTextEntry={true}
                        />
                    } />
                </Section>

                {
                    serverIndex && (
                        <Section
                            header={"DELETE"}
                            roundedCorners={true}
                            hideSurroundingSeparators={true}
                        >
                            <Cell cellContentView={
                                <Button title={"Delete Server"} color={"red"} onPress={onDeletePress} />
                            } />
                        </Section>
                    )
                }
            </TableView>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    table: {
        marginHorizontal: 15
    }
});

export default AddServerScreen;
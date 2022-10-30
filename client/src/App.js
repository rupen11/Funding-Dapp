import { Button, Col, Container, Row, Stack } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Header from "./components/Header";
import { useEffect, useState } from "react";
import Web3 from "web3";

function App() {
    const [web3Api, setWeb3Api] = useState({
        provider: null,
        web3: null,
    });

    const [account, setAccount] = useState(null);

    useEffect(() => {
        const loadProviders = async () => {
            try {
                let provider = null;

                if (window.ethereum) provider = window.ethereum;
                else if (window.web3) provider = window.web3.currentProvider;
                else if (!process.env.production)
                    provider = new Web3.providers.HttpProvider(
                        "http://127.0.0.1:7545"
                    );

                await provider.enable();

                setWeb3Api({
                    web3: new Web3(provider),
                    provider,
                });
            } catch (error) {
                console.log(error);
            }
        };
        loadProviders();
    }, []);

    useEffect(() => {
        const getAccount = async () => {
            try {
                const accounts = await web3Api.web3.eth.getAccounts();
                setAccount(accounts[0]);
            } catch (error) {
                console.log(error);
            }
        };

        web3Api.web3 && getAccount();
    }, [web3Api.web3]);

    return (
        <>
            <Header />
            <Container style={{ textAlign: "center" }} className="mt-4">
                <Row className="justify-content-md-center">
                    <Col md="auto">
                        <Button
                            style={{
                                display: "inline",
                                fontSize: 10,
                                paddingInline: 5,
                                paddingBlock: 2,
                                backgroundColor: account
                                    ? "lightgreen"
                                    : "salmon",
                                color: account ? "green" : "darkred",
                                borderColor: account ? "green" : "darkred",
                            }}
                        >
                            {account ? "Connected" : "Not Connected"}
                        </Button>
                        <Stack direction="vertical" gap={3} className="mt-4">
                            <h1 className="heading">Balance: 100 ETH</h1>
                            <h4 className="heading">
                                Account:{" "}
                                {account ? account : "0x000000000000000000"}
                            </h4>
                        </Stack>
                        <Stack
                            direction="horizontal"
                            gap={3}
                            className="mt-4"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Button
                                variant="success"
                                onClick={async () => {
                                    const accounts =
                                        await window.ethereum.request({
                                            method: "eth_requestAccounts",
                                        });
                                    console.log(accounts);
                                }}
                            >
                                Connect to Metamask
                            </Button>
                            <Button variant="success">Transfer</Button>
                            <Button variant="primary">Withdraw</Button>
                        </Stack>
                    </Col>
                </Row>
            </Container>
            <footer
                style={{
                    textAlign: "center",
                    backgroundColor: "rgb(245, 245, 245)",
                    padding: "10px",
                    color: "gray",
                    marginTop: "2rem",
                }}
            >
                Made with Love by RJ
            </footer>
        </>
    );
}

export default App;

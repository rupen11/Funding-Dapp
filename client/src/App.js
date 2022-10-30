import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Col, Container, Row, Stack } from "react-bootstrap";
import "./App.css";
import Header from "./components/Header";
import { useEffect, useState } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "./utils/load-contract";

function App() {
    const [web3Api, setWeb3Api] = useState({
        provider: null,
        web3: null,
        contract: null,
    });

    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(0);
    const [reload, shouldReload] = useState(false);

    const transferFund = async () => {
        try {
            const { contract, web3 } = web3Api;
            await contract.transfer({
                from: account,
                value: web3.utils.toWei("2", "ether"),
            });
        } catch (error) {
            console.log(error);
        }
        reloadEffect();
    };

    const withdrawFund = async () => {
        try {
            const { contract, web3 } = web3Api;
            await contract.withdraw(web3.utils.toWei("2", "ether"), {
                from: account,
            });
        } catch (error) {
            console.log(error);
        }
        reloadEffect();
    };

    const reloadEffect = () => shouldReload(!reload);

    useEffect(() => {
        const loadProviders = async () => {
            try {
                const provider = await detectEthereumProvider();
                const contract = await loadContract("Funder", provider);

                if (provider) {
                    provider.request({ method: "eth_requestAccounts" });
                    setWeb3Api({
                        web3: new Web3(provider),
                        provider,
                        contract,
                    });
                } else {
                    console.error("Please Install Metamask!");
                }

                // if (window.ethereum) provider = window.ethereum;
                // else if (window.web3) provider = window.web3.currentProvider;
                // else if (!process.env.production)
                //     provider = new Web3.providers.HttpProvider(
                //         "http://127.0.0.1:7545"
                //     );
                // await provider.enable();
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

    useEffect(() => {
        const loadBalance = async () => {
            const { contract, web3 } = web3Api;
            const balance = await web3.eth.getBalance(contract.address);
            setBalance(web3.utils.fromWei(balance, "ether"));
        };
        web3Api.contract && loadBalance();
    }, [web3Api, reload]);

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
                            <h1 className="heading">Balance: {balance} ETH</h1>
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
                            {!account && (
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
                            )}
                            <Button variant="success" onClick={transferFund}>
                                Transfer
                            </Button>
                            <Button variant="primary" onClick={withdrawFund}>
                                Withdraw
                            </Button>
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

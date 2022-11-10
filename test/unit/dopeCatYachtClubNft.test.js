const { network, getNamedAccounts, deployments, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const { assert, expect } = require("chai");
const { getContractAddress } = require("ethers/lib/utils");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("DopeCatYachtClubNft", () => {
          let dopeCatYachtClubNft, vrfCoordinatorV2Mock;
          beforeEach(async () => {
              const deployer = (await getNamedAccounts()).deployer;
              await deployments.fixture(["mocks", "dopeCatYachtClubNft"]);
              dopeCatYachtClubNft = await ethers.getContract(
                  "DopeCatYachtClubNft",
                  deployer
              );
              vrfCoordinatorV2Mock = await ethers.getContract(
                  "VRFCoordinatorV2Mock"
              );
          });

          describe("constructor", () => {
              it("Intiializes the nft contract correctly: token count", async () => {
                  let expectedTokenCount = "0";
                  tokenCounter = await dopeCatYachtClubNft.getTokenCounter();
                  assert(
                      tokenCounter.toString(),
                      expectedTokenCount.toString()
                  );
              });

              it("Intiializes the contract correctly: token URI", async () => {
                  let expectedTokenUri =
                      "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-jaguar-earth.json";
                  let uriIndex = 0;
                  let tokenUri = await dopeCatYachtClubNft.getTokenUri(
                      uriIndex
                  );
                  assert(tokenUri.toString(), expectedTokenUri.toString());
              });
          });

          describe("requestNft", () => {
              it("fails if payment isn't sent with the request", async () => {
                  await expect(
                      dopeCatYachtClubNft.requestNft()
                  ).to.be.revertedWithCustomError(
                      dopeCatYachtClubNft,
                      "DopeCatYachtClubNft__InsufficientFunds"
                  );
              });
              it("fails if payment amount is less than the mint fee", async () => {
                  const expectedMintFee =
                      await dopeCatYachtClubNft.getMintFee();
                  await expect(
                      dopeCatYachtClubNft.requestNft({
                          value: expectedMintFee.sub(
                              ethers.utils.parseEther("0.00001")
                          ),
                      })
                  ).to.be.revertedWithCustomError(
                      dopeCatYachtClubNft,
                      "DopeCatYachtClubNft__InsufficientFunds"
                  );
              });
              it("emits an event and kicks off a random word request", async () => {
                  const mintFee = await dopeCatYachtClubNft.getMintFee();
                  await expect(
                      dopeCatYachtClubNft.requestNft({
                          value: mintFee.toString(),
                      })
                  ).to.emit(dopeCatYachtClubNft, "NftRequested");
              });
          });
          describe("fulfillRandomWords", () => {
              it("mints NFT after random number is returned", async () => {
                  await new Promise(async (resolve, reject) => {
                      dopeCatYachtClubNft.once("NftMinted", async () => {
                          try {
                              const tokenUri =
                                  await dopeCatYachtClubNft.tokenURI("0");
                              const tokenCount =
                                  await dopeCatYachtClubNft.getTokenCounter();
                              assert.equal(
                                  tokenUri.toString().includes("ipfs://"),
                                  true
                              );

                              assert.equal(tokenCount.toString(), "1");
                              resolve();
                          } catch (error) {
                              console.log(`ERROR: ${error}`);
                              reject(error);
                          }
                      });
                      try {
                          const mintFee =
                              await dopeCatYachtClubNft.getMintFee();

                          const requestNftResponse =
                              await dopeCatYachtClubNft.requestNft({
                                  value: mintFee.toString(),
                              });

                          const requestNftReceipt =
                              await requestNftResponse.wait(1);

                          await vrfCoordinatorV2Mock.fulfillRandomWords(
                              requestNftReceipt.events[1].args[0].toString(),
                              dopeCatYachtClubNft.address
                          );
                      } catch (error) {
                          console.log(`ERROR: ${error}`);
                          reject(error);
                      }
                  });
              });
          });

          describe("getBackgroundFromModdedRng", () => {
              //[10, 25, 50, MAX_CHANCE_VALUE]
              it("should return desert if moddedRng 0 - 9", async () => {
                  const expectedValue =
                      await dopeCatYachtClubNft.getBackgroundFromModdedRng(8);
                  assert.equal(0, expectedValue);
              });
              it("should return ice if moddedRng is between 10 - 24", async () => {
                  const expectedValue =
                      await dopeCatYachtClubNft.getBackgroundFromModdedRng(18);
                  assert.equal(1, expectedValue);
              });
              it("should return jungle if moddedRng is between 25 - 49", async () => {
                  const expectedValue =
                      await dopeCatYachtClubNft.getBackgroundFromModdedRng(30);
                  assert.equal(2, expectedValue);
              });

              it("should return savannah if moddedRng is between 50 - 99", async () => {
                  const expectedValue =
                      await dopeCatYachtClubNft.getBackgroundFromModdedRng(60);
                  assert.equal(3, expectedValue);
              });

              it("should revert if moddedRng >= 100", async () => {
                  await expect(
                      dopeCatYachtClubNft.getBackgroundFromModdedRng(100)
                  ).to.be.revertedWithCustomError(
                      dopeCatYachtClubNft,
                      "DopeCatYachtClubNft__BackgroundIndexOutOfRange"
                  );
              });
          });

          describe("getCatTypeFromModdedRng", () => {
              //[5, 15, 35, 60, MAX_CHANCE_VALUE]

              it("should return jaguar if moddedRng 0 - 4", async () => {
                  const expectedValue =
                      await dopeCatYachtClubNft.getCatTypeFromModdedRng(2);
                  assert.equal(0, expectedValue);
              });
              it("should return lion if moddedRng is between 5 - 14", async () => {
                  const expectedValue =
                      await dopeCatYachtClubNft.getCatTypeFromModdedRng(10);
                  assert.equal(1, expectedValue);
              });
              it("should return puma if moddedRng is between 15 - 34", async () => {
                  const expectedValue =
                      await dopeCatYachtClubNft.getCatTypeFromModdedRng(30);
                  assert.equal(2, expectedValue);
              });

              it("should return tiger if moddedRng is between 35 - 59", async () => {
                  const expectedValue =
                      await dopeCatYachtClubNft.getCatTypeFromModdedRng(40);
                  assert.equal(3, expectedValue);
              });

              it("should return white tiger if moddedRng is between 60 - 99", async () => {
                  const expectedValue =
                      await dopeCatYachtClubNft.getCatTypeFromModdedRng(70);
                  assert.equal(4, expectedValue);
              });

              it("should revert if moddedRng >= 100", async () => {
                  await expect(
                      dopeCatYachtClubNft.getCatTypeFromModdedRng(100)
                  ).to.be.revertedWithCustomError(
                      dopeCatYachtClubNft,
                      "DopeCatYachtClubNft__CatTypeIndexOutOfRange"
                  );
              });
          });

          describe("getPlanetFromModdedRng", () => {
              //[10, 20, 30, 40, 50, 60, 70, 80, 90, MAX_CHANCE_VALUE]
              it("should return earth if moddedRng 0 - 9", async () => {
                  const expectedValue =
                      await dopeCatYachtClubNft.getPlanetFromModdedRng(8);
                  assert.equal(0, expectedValue);
              });
              it("should return jupiter if moddedRng is between 10 - 19", async () => {
                  const expectedValue =
                      await dopeCatYachtClubNft.getPlanetFromModdedRng(18);
                  assert.equal(1, expectedValue);
              });
              it("should return mars if moddedRng is between 20 - 29", async () => {
                  const expectedValue =
                      await dopeCatYachtClubNft.getPlanetFromModdedRng(28);
                  assert.equal(2, expectedValue);
              });

              it("should return mercury if moddedRng is between 30 - 39", async () => {
                  const expectedValue =
                      await dopeCatYachtClubNft.getPlanetFromModdedRng(38);
                  assert.equal(3, expectedValue);
              });

              it("should return neptune if moddedRng is between 40 - 49", async () => {
                  const expectedValue =
                      await dopeCatYachtClubNft.getPlanetFromModdedRng(48);
                  assert.equal(4, expectedValue);
              });

              it("should return saturn if moddedRng is between 50 - 59", async () => {
                  const expectedValue =
                      await dopeCatYachtClubNft.getPlanetFromModdedRng(58);
                  assert.equal(5, expectedValue);
              });

              it("should return the moon if moddedRng is between 60 - 69", async () => {
                  const expectedValue =
                      await dopeCatYachtClubNft.getPlanetFromModdedRng(68);
                  assert.equal(6, expectedValue);
              });

              it("should return the sun if moddedRng is between 70 - 79", async () => {
                  const expectedValue =
                      await dopeCatYachtClubNft.getPlanetFromModdedRng(78);
                  assert.equal(7, expectedValue);
              });

              it("should return uranus if moddedRng is between 80 - 89", async () => {
                  const expectedValue =
                      await dopeCatYachtClubNft.getPlanetFromModdedRng(88);
                  assert.equal(8, expectedValue);
              });

              it("should return venus if moddedRng is between 90 - 99", async () => {
                  const expectedValue =
                      await dopeCatYachtClubNft.getPlanetFromModdedRng(98);
                  assert.equal(9, expectedValue);
              });

              it("should revert if moddedRng >= 100", async () => {
                  await expect(
                      dopeCatYachtClubNft.getPlanetFromModdedRng(100)
                  ).to.be.revertedWithCustomError(
                      dopeCatYachtClubNft,
                      "DopeCatYachtClubNft__PlanetIndexOutOfRange"
                  );
              });
          });
      });

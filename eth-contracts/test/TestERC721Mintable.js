var ERC721MintableComplete = artifacts.require('CustomERC721Token');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () {

            this.contract = await ERC721MintableComplete.new({from: account_one});

            // TODO: mint multiple tokens
            this.contract.mint(accounts[2],1);
            this.contract.mint(accounts[3],2);
            this.contract.mint(accounts[2],3);
            this.contract.mint(accounts[4],4);
        })

        it('should return total supply', async function () {
          let total = await this.contract.totalSupply();

          assert.equal(total,4, 'The total supply is incorrect');
        })

        it('should get token balance', async function () {
          let balance = await this.contract.balanceOf(accounts[2]);

          assert.equal(balance,2, 'the balance is incorrect for account 2');
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () {
          let tokenURI = await this.contract.tokenURI(4);
          //console.log(tokenURI+" here!");
          assert.equal(tokenURI,'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/4', 'the tokenURI is incorrect for account 4');
        })

        it('should transfer token from one owner to another', async function () {
            await this.contract.transferFrom(accounts[2],accounts[5],3,{from: accounts[2]});
            let balanceAcc2 = await this.contract.balanceOf(accounts[2]);
            let balanceAcc5 = await this.contract.balanceOf(accounts[5]);
            assert.equal(balanceAcc2,1, 'the balance is incorrect for account 2');
            assert.equal(balanceAcc5,1, 'the balance is incorrect for account 5');
            let tokenIdForAcc2 = await this.contract.tokenOfOwnerByIndex(accounts[2],0);
            let tokenIdForAcc5 = await this.contract.tokenOfOwnerByIndex(accounts[5],0);
            assert.equal(tokenIdForAcc2,1, 'the balance is incorrect for account 2');
            assert.equal(tokenIdForAcc5,3, 'the balance is incorrect for account 5');
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () {
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () {

          let accessDenied = false
          try {
            await this.contract.mint(accounts[2],213,{from: account_two});
          } catch (e) {
            accessDenied = true
          }
          assert(accessDenied, 'Access is not restricted to Contract Owner')
        })

        it('should return contract owner', async function () {
            let owner = await this.contract.getOwner();
            //console.log(owner); // double check
            assert.equal(owner,account_one, 'Error: not account owner');
        })

    });
})

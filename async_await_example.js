function listUsers() {
  return new Promise((resolve, reject) => {
    resolve(
      [
        {
          id: "1",
          firstName: "Rick",
          lastName: "Zawadzki",
          address: "123 Maple Street"
        },
        {
          id: "2",
          firstName: "Doctor",
          lastName: "Who",
          address: "TARDIS"
        },
        {
          id: "3",
          firstName: "The",
          lastName: "Master",
          address: "Gallifrey"
        },
      ]
    )
  });
}

function getUserActivity(id) {
  return new Promise((resolve, reject) => {
  	const activityList =  [
        {
          id: "1",
          // credits
          payments: [
            {
              date: 8,
              amount: 5
            },
            {
              date: 15,
              amount: 3
            },
          ],
          // debits
          purchases: [
            {
              date: 8,
              amount: 2
            },
            {
              date: 15,
              amount: 1
            },
          ]
        },
        {
          id: "2",
          // credits
          payments: [
            {
              date: 10,
              amount: 2
            },
            {
              date: 12,
              amount: 1
            },
          ],
          // debits
          purchases: [
            {
              date: 10,
              amount: 15
            },
            {
              date: 12,
              amount: 13
            },
          ]
        },
        {
          id: "3",
          // credits
          payments: [
            {
              date: 21,
              amount: 15
            },
            {
              date: 24,
              amount: 1
            },
          ],
          // debits
          purchases: [
            {
              date: 21,
              amount: 30
            },
            {
              date: 24,
              amount: 1
            },
          ]
        }
      ];

    let response = activityList.filter(activity => activity.id === id).map((activity) => {
    	return activity
    });

    resolve(response);
  });
}

function sendBill(firstName,lastName, address, totalOwed) {
	return new Promise(resolve => {

  	resolve(
    	{
        message: "Bill sent.",
        success: true,
        firstName: firstName,
        lastName: lastName,
        address: address,
        totalOwed: totalOwed
      }
    )
  });
}

function financialSummary(activityList) {
  let response = activityList.map((activity) => {
    const responseObj = {
    	id: activity.id,
    	userPaymentsCount: activity.payments.length,
      userPurchasesCount: activity.purchases.length,
      totalUserPayments: 0,
      totalUserPurchases: 0,
      totalMoneyOwed: 0
    };

    activity.payments.map(payment => {
    	responseObj.totalUserPayments = responseObj.totalUserPayments + payment.amount;
    });

    activity.purchases.map(purchase => {
    	responseObj.totalUserPurchases = responseObj.totalUserPurchases + purchase.amount;
    });

    responseObj.totalMoneyOwed = responseObj.totalUserPurchases - responseObj.totalUserPayments;

    return responseObj;
  });

  return response
}

async function processPayment(user, paymentDetails) {
	return new Promise(resolve => {
  	let sendCount = 0;
    let totalOwed = 0;
    let response = {
    	message: "Bill not sent.",
      success: false,
      firstName: "",
      lastName: "",
      address: "",
      totalOwed: 0
    };

    paymentDetails.map(async detail => {
    	if(detail.totalMoneyOwed > 0) {
      	response = await sendBill(user.firstName, user.lastName, user.address, detail.totalMoneyOwed);

				resolve(response);
      } else {
      	resolve(response);
      }
    });
  });
}

async function app() {
	const users = await listUsers();
  const generateFinancialInfo = users.map(async (user) => {
    const userActivityList = await getUserActivity(user.id);
    const purchasePaymentSummary = await financialSummary(userActivityList);
    const billSend = await processPayment(user, purchasePaymentSummary);

    return billSend;
  })

  return Promise.all(generateFinancialInfo);
}


app().then(results => {
  let financialReport = {
  	billsSent: 0,
    totalAmountOwed: 0
  };

  results.forEach(row => {
  	if(row.success === true) {
      financialReport.billsSent++;
      financialReport.totalAmountOwed = financialReport.totalAmountOwed + row.totalOwed;
    }
  });

  console.log(financialReport);

});

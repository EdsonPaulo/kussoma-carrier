import * as SQLite from 'expo-sqlite';

export const checkDatabase = () => {
  const db = SQLite.openDatabase('db.kussoma');
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS fretes (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, count INT)',
    );
  });
};

export const readFretes = async () => {
  const db = SQLite.openDatabase('db.kussoma');

  db.transaction(tx =>
    tx.executeSql(
      'SELECT * FROM fretes',
      null,
      (txObj, { rows: { resultSet } }) => {
        console.log(resultSet);
        return resultSet;
      },
      // failure callback which sends two things Transaction object and Error
      (txObj, error) => console.log('Error ', error),
    ),
  );
};

export const saveFretes = () => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO fretes (text, count) values (?, ?)',
      ['gibberish', 0],
      (txObj, resultSet) => {
        console.log(resultSet);
        return resultSet;
      },
      (txObj, error) => console.log('Error', error),
    );
  });
};

export const updateFretes = () => {
  db.transaction(tx => {
    tx.executeSql(
      'UPDATE items SET count = count + 1 WHERE id = ?',
      [id],
      (txObj, resultSet) => {
        console.log(resultSet);
        return resultSet;
      },
    );
  });
};

export const deleteFrete = () => {};

export const deleteFretes = id => {
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM items WHERE id = ? ',
      [id],
      (txObj, resultSet) => {
        if (resultSet.rowsAffected > 0) {
          let newList = this.state.data.filter(data => {
            if (data.id === id) return false;
            else return true;
          });
          this.setState({ data: newList });
        }
      },
    );
  });
};

/**
    insertCategories(arrCateData){

    let keys = Object.keys(arrCateData[0])

    let arrValues = []

    var len = arrCateData.length;

    for (let i = 0; i < len; i++) {
      arrCateData[i].image = `"${arrCateData[i].image}"`;
      arrCateData[i].thumbnail = `"${arrCateData[i].thumbnail}"`;
      arrCateData[i].name = `"${arrCateData[i].name}"`;
      arrCateData[i].path = `"${arrCateData[i].path}"`;
      arrValues.push("(" + Object.values(arrCateData[i]) +")");
    }

    // console.log(arrValues)

    return new Promise((resolve) => {
        this.initDB().then((db) => {
        db.transaction((tx) => {
            tx.executeSql("INSERT INTO category ("+ keys + ") VALUES " + String(arrValues)).then(([tx, results]) => {
            resolve(results);
            });
        }).then((result) => {
            this.closeDatabase(db);
        }).catch((err) => {
            console.log(err);
        });
        }).catch((err) => {
        console.log(err);
        });
    });

    'INSERT INTO Employees (name,office,departement) VALUES (?,?,?),(?,?,?),(?,?,?)',
    ['Sylvester Stallone',2,4,'Elvis Presley',2,4,'Leslie Nelson',3,4],

    }
 */

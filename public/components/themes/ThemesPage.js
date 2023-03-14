"use strict";

const e = React.createElement;

class ThemesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { newPartName: "", parts: [] };
  }
  componentDidMount() {
    this.getParts().then();
  }

  getParts = async () => {
    const response = await getData("/themes/getAll");
    this.setState({ parts: response.parts });
  };
  getDate = (date) => {
    const createdDate = new Date(date);
    return createdDate.toLocaleString();
  };

  onChangeName = (event) => {
    this.setState({ newPartName: event.target.value });
  };

  savePart = async () => {
    const newPart = { part: this.state.newPartName, created: new Date() };
    const createdPart = await postData("/themes/createPart", newPart);
    this.setState((previousState) => ({
      parts: [createdPart, ...previousState.parts],
    }));
  };

  render() {
    return (
      <div>
        <div className="input-group mt-2 mb-3">
          <button
            className="btn btn-outline-dark me-1 mt-1"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Добавить тему
          </button>

          <div
            className="modal fade"
            id="exampleModal"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Создать новую тему?
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Введите наименование..."
                    onChange={this.onChangeName}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Отмена
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={!this.state.newPartName}
                    onClick={this.savePart}
                    data-bs-dismiss="modal"
                  >
                    Сохранить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={"tableContent"}>
          <table
            className={
              "table table-sm table-bordered table-hover table-responsive table-striped"
            }
          >
            <thead className={"table-dark"}>
              <tr>
                <th>Наименование</th>
                <th>Дата создания</th>
              </tr>
            </thead>
            <tbody>
              {this.state.parts.map((part) => (
                <tr key={part._id}>
                  <td>{part.part}</td>
                  <td>{this.getDate(part.created)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const domContainer = document.querySelector("#theme-container");
const root = ReactDOM.createRoot(domContainer);
root.render(e(ThemesPage));

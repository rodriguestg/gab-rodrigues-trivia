import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { loginAction, quizApi } from '../redux/actions';

class Login extends React.Component {
  constructor() {
    super();

    this.state = {
      name: '',
      email: '',
    };
  }

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({
      [name]: value,
    });
  }

  buttonValidation = () => {
    const { name, email } = this.state;
    if (name.length > 0 && email.length > 0) {
      return false;
    }
    return true;
  }

  getToken = async () => (fetch('https://opentdb.com/api_token.php?command=request')
    .then((response) => response.json())
    .then((data) => data.token));

  loginOnClick = async () => {
    const { getQuiz, history, loginFunction } = this.props;
    const { name, email } = this.state;
    const token = await this.getToken();
    localStorage.setItem('token', token);
    await getQuiz(token);
    loginFunction({ name, email });
    history.push('/game');
  }

  render() {
    const { name, email } = this.state;
    return (
      <div>
        <form>
          <label htmlFor="name">
            Nome:
            <input
              data-testid="input-player-name"
              type="text"
              name="name"
              id="name"
              value={ name }
              onChange={ this.handleChange }
            />
          </label>
          <label htmlFor="email">
            Email:
            <input
              data-testid="input-gravatar-email"
              type="text"
              name="email"
              id="email"
              value={ email }
              onChange={ this.handleChange }
            />
          </label>
          <button
            data-testid="btn-play"
            type="button"
            disabled={ this.buttonValidation() }
            onClick={ this.loginOnClick }
          >
            Play
          </button>
        </form>
        <Link to="/settings">
          <button data-testid="btn-settings" type="button">Configurações</button>
        </Link>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  getQuiz: (token) => dispatch(quizApi(token)),
  loginFunction: (user) => dispatch(loginAction(user)),
});

Login.propTypes = {
  getQuiz: PropTypes.func.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  loginFunction: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(Login);

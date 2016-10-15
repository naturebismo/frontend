import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import Markdown from 'react-remarkable';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import {FormattedMessage} from 'react-intl';
import { Media, Button } from "react-bootstrap";

import {
    injectIntl,
    FormattedRelative,
} from 'react-intl';

const ProfileDate = injectIntl(({date, intl}) => (
    <span title={intl.formatDate(date)}>
        <FormattedRelative value={date}/>
    </span>
));

class Plant extends React.Component {
  render() {
    var user = this.props.user;

    var plant = {
      name: 'Mangifera indica',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Mangoes_pic.jpg/220px-Mangoes_pic.jpg',
    }
    
    return (
      <div className="col-xs-12">
        <Helmet
          title={plant.name}
        />

        <div className="page-header" style={{marginTop: 0}}>
          <h1 style={{marginTop: 0}}>Mangueira <i className="fa fa-check-circle-o" aria-hidden="true" title="Espécie verificada"></i></h1>
          <h2 style={{marginTop: 0}}>{plant.name}</h2>
        </div>

        <div className="row">
        <div className="col-md-3">
          <img src={plant.image} alt={plant.name} className="img-responsive" style={{width: '100%'}} />

          <p>
            <span className="label label-success">Comestivel</span> <span className="label label-success">Medicinal</span>
          </p>

          <div className="table-responsive">
            <table className="table">
            <tbody>
              <tr>
                <td>Reino:</td>
                <td><a href="#">Plantae</a></td>
              </tr>
              <tr>
                <td>Divisão:</td>
                <td><a href="#">Anthophyta</a></td>
              </tr>
              <tr>
                <td>Classe:</td>
                <td><a href="#">Magnoliopsida</a></td>
              </tr>
              <tr>
                <td>Ordem:</td>
                <td><a href="#">Sapindales</a></td>
              </tr>
              <tr>
                <td>Família:</td>
                <td><a href="#">Anacardiaceae</a></td>
              </tr>
              <tr>
                <td>Género:</td>
                <td><a href="#">Mangifera</a></td>
              </tr>
              <tr>
                <td>Espécie:</td>
                <td>M. indica</td>
              </tr>
            </tbody>
            </table>
          </div>

          <br />
          Cadastrado por <a href="#">alisson</a><br />
          <i className="fa fa-clock-o" aria-hidden="true"></i> 19 de Setembro de 2014 às 16:36
          <br />
          <br />
          Última alteração por <a href="#">alisson</a><br />
          <i className="fa fa-clock-o" aria-hidden="true"></i> 19 de Setembro de 2014 às 16:36
          <br />
          <br />
          <a href="#">Historico de alterações <span className="badge">19</span></a>
        </div>

        <div className="col-md-9">

          <div className="btn-group" role="group" aria-label="...">
            <button type="button" className="btn btn-default">Plantei</button>
            <button type="button" className="btn btn-default">Quero Plantar</button>
          </div>

          <br />
          <br />

          <ul className="nav nav-tabs">
            <li role="presentation" className="active"><a href="#">Descrição</a></li>
            <li role="presentation"><a href="#">Fotos <span className="badge">15</span></a></li>
            <li role="presentation"><a href="#">Usos <span className="badge">9</span></a></li>
            <li role="presentation"><a href="#">Localizações <span className="badge">53</span></a></li>
            <li role="presentation"><a href="#">Troca de sementes e mudas <span className="badge">2</span></a></li>
          </ul>

          <br />

          <p>As mangueiras são grandes e frondosas árvores, podendo atingir entre 35 e 40 metros de altura, com um raio de copa próximo de 10 metros. Suas folhas botânicas são perenes, entre 15 e 35 centímetros de comprimento e entre seis e 16 centímetros de largura.Quando jovens estas folhas são verde-folha. As flores são diminutas, em inflorescências paniculadas nas extremidades dos ramos. São tantas que seu perfume é sentido a boa pertice.</p>
          <p>As sementes, quando plantadas em solo fértil e bem irrigado, podem germinar com facilidade e originar novas árvores de crescimento rápido nos primeiros anos. Desta forma a mangueira tem se disseminado pelas formações vegetacionais nativas no Brasil, e apresentam uma ameaça à vegetação nativa quando sua cultura não tem o manejo adequado.</p>

          <h4>Nomes comuns</h4>
          <ol>
            <li>Mangeira - PT - BR</li>
            <li>Manga - PT -</li>
            <li>Mango - EN - US</li>
          </ol>

          <h4>Sinonimos</h4>
          <ol>
            <li>Mangifera amba Forsk.</li>
            <li>Mangifera anisodora Blanco</li>
            <li>....</li>
          </ol>

          <h4>Referencias</h4>
          <ol>
            <li><a href="http://www.catalogueoflife.org/col/details/species/id/c70d54a9ef1a724dbd62ec36c9702f64" target="_blank">http://www.catalogueoflife.org/col/details/species/id/c70d54a9ef1a724dbd62ec36c9702f64</a></li>
            <li><a href="https://pt.wikipedia.org/wiki/Mangifera_indica" target="_blank">https://pt.wikipedia.org/wiki/Mangifera_indica</a></li>
          </ol>
        </div>
        </div>

      </div>
    );
  }
}

export default Relay.createContainer(Plant, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Query {
        id,
        me {
          username
          isAuthenticated
        },
      }
    `,
  },
});

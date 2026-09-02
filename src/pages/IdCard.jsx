import { useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { fdate, todayStr } from '../utils/helpers';
import PageHeader from '../components/layout/PageHeader';
import BottomNav from '../components/layout/BottomNav';

export default function IdCard() {
  const { id } = useParams();
  const { db, settings } = useApp();

  const member =
    db.members.find((x) => String(x.ID) === String(id)) || {
      ID: '—',
      Name: 'Devendra Nishad',
      Mobile: '79743 59208',
      Village: 'ग्राम पंचायत नगरगांव धरसींवा रायपुर छत्तीसगढ़ - 493111',
      JoinDate: todayStr(),
    };

  return (
    <div className="app" style={{ background: '#f5f5f5' }}>
      <PageHeader title="सदस्य पहचान पत्र" subtitle="Member ID Card" backTo="/members" />

      <div className="idcard-wrap">
        <div className="new-idcard">
          <div className="new-idcard-header">
            <div className="new-idcard-logo" style={{ color: '#ff7600', fontSize: '30px', fontWeight: 'bold', lineHeight: '1', paddingBottom: '4px' }}>
              ॐ
            </div>
            <div className="new-idcard-header-text">
              <h2>जय बजरंग युवा गणेश उत्सव समिति</h2>
              <p>एकता • सेवा • संस्कार • विकास</p>
            </div>
          </div>
          
          <div className="new-idcard-body">
            <div className="new-idcard-photo-container">
              {/* If we have a photo we show it, else generic */}
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.Name)}&background=f1f5f9&color=64748b&size=120`} alt="Profile" />
            </div>
            
            <div className="new-idcard-details">
              <div className="new-idcard-row">
                <div className="new-idcard-icon-label">
                  <div className="new-idcard-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                  <span className="label">नाम</span>
                </div>
                <div className="new-idcard-separator"></div>
                <div className="new-idcard-value">{member.Name}</div>
              </div>
              
              <div className="new-idcard-row">
                <div className="new-idcard-icon-label">
                  <div className="new-idcard-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
                  </div>
                  <span className="label">पद</span>
                </div>
                <div className="new-idcard-separator"></div>
                <div className="new-idcard-value highlight-orange">कोषाध्यक्ष</div>
              </div>
              
              <div className="new-idcard-row">
                <div className="new-idcard-icon-label">
                  <div className="new-idcard-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  </div>
                  <span className="label">आयु</span>
                </div>
                <div className="new-idcard-separator"></div>
                <div className="new-idcard-value">23</div>
              </div>
              
              <div className="new-idcard-row">
                <div className="new-idcard-icon-label">
                  <div className="new-idcard-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </div>
                  <span className="label">मोबाइल</span>
                </div>
                <div className="new-idcard-separator"></div>
                <div className="new-idcard-value">{member.Mobile}</div>
              </div>
            </div>
          </div>
          
          <div className="new-idcard-footer">
            <span>ग्राम एवं पोस्ट - नगरगांव, धरसींवा, रायपुर</span>
          </div>
        </div>
      </div>

      <BottomNav active="members" />
    </div>
  );
}

import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";

module {
  type ParticipantRecord = {
    registrationId : Text;
    name : Text;
    age : Nat;
    gender : Text;
    education : Text;
    occupation : Text;
    smokingStatus : Text;
    tbContactHistory : Text;
    preTestScore : ?Nat;
    postTestScore : ?Nat;
    improvement : ?Int;
    riskLevel : ?Text;
    dateTime : Text;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, { name : Text }>;
    ParticipantRecords : Map.Map<Text, ParticipantRecord>;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, { name : Text }>;
    participantRecords : Map.Map<Text, ParticipantRecord>;
  };

  public func run(old : OldActor) : NewActor {
    {
      userProfiles = old.userProfiles;
      participantRecords = old.ParticipantRecords;
    };
  };
};

import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Char "mo:core/Char";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Initialize the access control state for authentication and authorization.
  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  public type ParticipantRecord = {
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

  module ParticipantRecord {
    public func compare(p1 : ParticipantRecord, p2 : ParticipantRecord) : Order.Order {
      Text.compare(p1.registrationId, p2.registrationId);
    };
  };

  let participantRecords = Map.empty<Text, ParticipantRecord>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  func generateRandomSuffix() : Text {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let charsArray = chars.toArray();
    var suffix = "";

    for (_ in Nat.range(0, 5)) {
      let timeSeed = Time.now();
      let index = Int.abs(timeSeed % 36);
      suffix #= Text.fromChar(charsArray[index]);
    };
    suffix;
  };

  // Participant functions (no authorization check)
  public shared ({ caller }) func registerParticipant(
    name : Text,
    age : Nat,
    gender : Text,
    education : Text,
    occupation : Text,
    smokingStatus : Text,
    tbContactHistory : Text,
    dateTime : Text,
  ) : async Text {
    let registrationId = "TBSMART-" # generateRandomSuffix();

    let participant : ParticipantRecord = {
      registrationId;
      name;
      age;
      gender;
      education;
      occupation;
      smokingStatus;
      tbContactHistory;
      preTestScore = null;
      postTestScore = null;
      improvement = null;
      riskLevel = null;
      dateTime;
    };

    participantRecords.add(registrationId, participant);
    registrationId;
  };

  public shared ({ caller }) func savePreTestScore(
    registrationId : Text,
    score : Nat,
  ) : async Bool {
    switch (participantRecords.get(registrationId)) {
      case (null) { false };
      case (?participant) {
        let updatedParticipant = { participant with preTestScore = ?score };
        participantRecords.add(registrationId, updatedParticipant);
        true;
      };
    };
  };

  public shared ({ caller }) func saveRiskLevel(
    registrationId : Text,
    riskLevel : Text,
  ) : async Bool {
    switch (participantRecords.get(registrationId)) {
      case (null) { false };
      case (?participant) {
        let updatedParticipant = { participant with riskLevel = ?riskLevel };
        participantRecords.add(registrationId, updatedParticipant);
        true;
      };
    };
  };

  public shared ({ caller }) func savePostTestScore(
    registrationId : Text,
    score : Nat,
  ) : async Bool {
    switch (participantRecords.get(registrationId)) {
      case (null) { false };
      case (?participant) {
        let improvement = switch (participant.preTestScore) {
          case (null) { null };
          case (?preScore) {
            ?(score - preScore : Int);
          };
        };
        let updatedParticipant = {
          participant with
          postTestScore = ?score;
          improvement;
        };
        participantRecords.add(registrationId, updatedParticipant);
        true;
      };
    };
  };

  public query ({ caller }) func getParticipant(
    registrationId : Text,
  ) : async ?ParticipantRecord {
    participantRecords.get(registrationId);
  };

  public query ({ caller }) func getAllParticipants() : async [ParticipantRecord] {
    participantRecords.values().toArray().sort();
  };

  public query ({ caller }) func getTotalParticipants() : async Nat {
    participantRecords.size();
  };

  public query ({ caller }) func getAveragePreTestScore() : async Float {
    let scores = participantRecords.values().toArray().map(func(p) { p.preTestScore }).filter(
      func(s) { s != null }
    );
    let validScores = scores.map(
      func(s) { switch (s) { case (null) { 0 }; case (?score) { score } } }
    );
    if (validScores.size() == 0) { return 0 };
    validScores.foldLeft(0, func(acc, score) { acc + score }).toFloat() / validScores.size().toInt().toFloat();
  };

  public query ({ caller }) func getAveragePostTestScore() : async Float {
    let scores = participantRecords.values().toArray().map(func(p) { p.postTestScore }).filter(
      func(s) { s != null }
    );
    let validScores = scores.map(
      func(s) { switch (s) { case (null) { 0 }; case (?score) { score } } }
    );
    if (validScores.size() == 0) { return 0 };
    validScores.foldLeft(0, func(acc, score) { acc + score }).toFloat() / validScores.size().toInt().toFloat();
  };

  public query ({ caller }) func getAverageImprovement() : async Float {
    let improvements = participantRecords.values().toArray().map(func(p) { p.improvement }).filter(
      func(i) { i != null }
    );
    let validImprovements = improvements.map(
      func(i) { switch (i) { case (null) { 0 }; case (?imp) { imp.toNat() } } }
    );
    if (validImprovements.size() == 0) { return 0 };
    validImprovements.foldLeft(0, func(acc, imp) { acc + imp }).toFloat() / validImprovements.size().toInt().toFloat();
  };

  public query ({ caller }) func getHighRiskCount() : async Nat {
    participantRecords.values().toArray().filter(
      func(p) {
        switch (p.riskLevel) {
          case (null) { false };
          case (?level) { level == "High" };
        };
      }
    ).size();
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };
};

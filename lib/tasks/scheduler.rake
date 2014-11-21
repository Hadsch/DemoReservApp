desc "CallPage"
task :callPage => :environment do
   uri = URI.parse('http://reserv.herokuapp.com/')
   Net::HTTP.get(uri)
end
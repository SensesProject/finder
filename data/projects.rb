#!/usr/bin/env ruby
# encoding: utf-8
Dir.chdir(File.dirname(__FILE__))

require "json"
require "csv"
require "awesome_print"

files = Dir["projects/*.csv"]

def readCSV (file)
  CSV.read("#{file}", { encoding: "UTF-8", headers: true }).map { |d| d.to_hash }
end

def buildDataStructure (arr)
	attributes = ['factsheet', 'topic', 'attribute', 'subattribute']
	temp = Array.new(attributes.length)

	arr.each do |row|
		attributes.each_with_index do |attribute, i|
			if row[attribute].nil?
				row[attribute] = temp[i]
			else
				temp[i] = row[attribute]
			end
		end
	end

	arr
end

def get (arr, obj)
	keys = obj.keys
	arr.select do |e|
		keys.all? { |key| e[key].eql? obj[key] }
	end
end

def extractData (arr)
	datum = get(arr, { 'factsheet' => 'AMPERE WP3', 'topic' => 'project' })
	if datum.length > 1
		datum.map { |e| e['value'] }
	else
		datum[0]['value']
	end
end

files.each do |file|
	raw = readCSV(file)
	data = buildDataStructure(raw)
	ap data
	ap extractData (data)
	# ap file
end
